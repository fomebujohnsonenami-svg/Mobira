"""File parser supporting .csv and .xlsx for Payment Lists import.

Uses Python standard library (csv, zipfile, xml.etree.ElementTree) so no heavy
external dependencies are needed and works 100% reliably in any environment.
"""

import io
import csv
import re
import zipfile
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Tuple

COLUMN_ALIASES = {
    "name": ["name", "full name", "recipient name", "beneficiary", "beneficiary name", "employee name"],
    "phone": ["phone number", "phone", "msisdn", "mobile", "telephone", "mobile number"],
    "provider": ["payment provider", "provider", "carrier", "channel", "rail", "network"],
    "account": ["account number", "account", "account identifier", "wallet number", "iban"],
    "amount": ["amount", "net amount", "sum", "gross amount", "total"],
}

SUPPORTED_PROVIDERS = [
    "MTN_MOMO", "MTN MOMO", "MTN",
    "ORANGE_MONEY", "ORANGE MONEY", "ORANGE",
    "BANK_TRANSFER", "BANK", "COMMERCIAL BANK", "EFT",
]

def validate_row(row: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Validates a single imported row and returns (is_valid, errors)."""
    errors = []

    name = str(row.get("name", "")).strip()
    if not name:
        errors.append("Name is required")

    phone = str(row.get("phone", "")).strip()
    if not phone:
        errors.append("Phone number is required")
    elif len(re.sub(r"[^\d+]", "", phone)) < 8:
        errors.append("Invalid phone number format")

    provider = str(row.get("provider", "")).strip().upper()
    if not provider:
        errors.append("Payment provider is required")

    account = str(row.get("account", "")).strip()
    if not account:
        errors.append("Account number is required")

    try:
        raw_amt = str(row.get("amount", "0")).replace(",", "").replace("GH₵", "").replace("GHS", "").replace("XAF", "").strip()
        amt = float(raw_amt)
        if amt <= 0:
            errors.append("Amount must be greater than 0")
        row["amount"] = amt
    except (ValueError, TypeError):
        errors.append("Amount must be a valid number")

    is_valid = len(errors) == 0
    return is_valid, errors

def normalize_headers(headers: List[str]) -> Dict[str, int]:
    """Maps recognized headers to column index."""
    header_map = {}
    for idx, raw_header in enumerate(headers):
        clean_header = raw_header.lower().strip()
        for key, aliases in COLUMN_ALIASES.items():
            if clean_header in aliases and key not in header_map:
                header_map[key] = idx
                break
    return header_map

def parse_csv(file_bytes: bytes) -> List[Dict[str, Any]]:
    """Parses a CSV file and extracts expected columns."""
    text = file_bytes.decode("utf-8-sig", errors="replace")
    reader = csv.reader(io.StringIO(text))
    rows = list(reader)
    if not rows:
        return []

    header_map = normalize_headers(rows[0])
    parsed_items = []

    for idx, row in enumerate(rows[1:], start=2):
        if not any(cell.strip() for cell in row):
            continue

        item = {
            "row_number": idx,
            "name": row[header_map["name"]].strip() if "name" in header_map and len(row) > header_map["name"] else "",
            "phone": row[header_map["phone"]].strip() if "phone" in header_map and len(row) > header_map["phone"] else "",
            "provider": row[header_map["provider"]].strip() if "provider" in header_map and len(row) > header_map["provider"] else "MTN_MOMO",
            "account": row[header_map["account"]].strip() if "account" in header_map and len(row) > header_map["account"] else "",
            "amount": row[header_map["amount"]].strip() if "amount" in header_map and len(row) > header_map["amount"] else 0,
        }

        is_valid, errors = validate_row(item)
        item["is_valid"] = is_valid
        item["errors"] = errors
        parsed_items.append(item)

    return parsed_items

def parse_xlsx(file_bytes: bytes) -> List[Dict[str, Any]]:
    """
    Parses an Excel .xlsx workbook using Python's standard zipfile and xml parser.
    Extracts sharedStrings.xml and xl/worksheets/sheet1.xml.
    """
    with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
        # 1. Read shared strings
        shared_strings = []
        if "xl/sharedStrings.xml" in z.namelist():
            ss_tree = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in ss_tree.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t"):
                shared_strings.append(si.text or "")

        # 2. Read sheet1
        sheet_xml = None
        for name in z.namelist():
            if name.startswith("xl/worksheets/sheet") and name.endswith(".xml"):
                sheet_xml = z.read(name)
                break

        if not sheet_xml:
            return []

        tree = ET.fromstring(sheet_xml)
        ns = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
        raw_rows = []

        for row_elem in tree.findall(f".//{ns}row"):
            current_row = []
            for c in row_elem.findall(f".//{ns}c"):
                t = c.attrib.get("t")
                v = c.find(f"{ns}v")
                val = ""
                if v is not None and v.text:
                    if t == "s":
                        idx = int(v.text)
                        val = shared_strings[idx] if idx < len(shared_strings) else ""
                    else:
                        val = v.text
                current_row.append(val)
            if current_row:
                raw_rows.append(current_row)

    if not raw_rows:
        return []

    header_map = normalize_headers(raw_rows[0])
    parsed_items = []

    for idx, row in enumerate(raw_rows[1:], start=2):
        if not any(str(cell).strip() for cell in row):
            continue

        item = {
            "row_number": idx,
            "name": str(row[header_map["name"]]).strip() if "name" in header_map and len(row) > header_map["name"] else "",
            "phone": str(row[header_map["phone"]]).strip() if "phone" in header_map and len(row) > header_map["phone"] else "",
            "provider": str(row[header_map["provider"]]).strip() if "provider" in header_map and len(row) > header_map["provider"] else "MTN_MOMO",
            "account": str(row[header_map["account"]]).strip() if "account" in header_map and len(row) > header_map["account"] else "",
            "amount": row[header_map["amount"]] if "amount" in header_map and len(row) > header_map["amount"] else 0,
        }

        is_valid, errors = validate_row(item)
        item["is_valid"] = is_valid
        item["errors"] = errors
        parsed_items.append(item)

    return parsed_items

def parse_payment_list_file(filename: str, file_bytes: bytes) -> List[Dict[str, Any]]:
    """Universal dispatcher for .csv and .xlsx files."""
    if filename.lower().endswith(".xlsx"):
        return parse_xlsx(file_bytes)
    return parse_csv(file_bytes)
