import pandas as pd
from io import BytesIO

def parse_csv(file_bytes: bytes):
    #Reading the uploaded csv into a dataframe
    df = pd.read_csv(BytesIO(file_bytes))

    #Normalize column names
    df.columns = [col.strip().lower() for col in df.columns]

    # Possible column name variations from banks
    column_mapping = {
        "transaction date": "date",
        "date": "date",
        "posting date": "date",

        "description": "description",
        "details": "description",
        "merchant": "description",

        "amount": "amount",
        "transaction amount": "amount",
        "debit": "amount",
    }

    # Rename columns into standard names
    df.rename(columns=column_mapping, inplace=True)

    #checking for missing
    missing = [col for col in ["date", "description", "amount"] if col not in df.columns]
    if missing:
        raise ValueError(f"Could not find these columns: {missing}. Found: {list(df.columns)}")


    # Keep only needed columns
    df = df[["date", "description", "amount"]]


    df["amount"] = pd.to_numeric(
        df["amount"].astype(str).str.replace(r"[$,]", "", regex=True),
        errors="coerce"
    )
    df = df.dropna(subset=["date", "description", "amount"])

    # Convert dataframe to list of dictionaries
    return df.to_dict(orient="records")
