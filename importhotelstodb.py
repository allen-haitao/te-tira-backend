import boto3
import pandas as pd
import uuid
from decimal import Decimal

# Initialize the DynamoDB client for DynamoDB Local
dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-west-2',  # Region name is required but can be anything
    endpoint_url='http://localhost:8000'  # DynamoDB Local endpoint
)
table = dynamodb.Table('Hotels')

# Load CSV data
csv_file = 'hotels.csv'  
df = pd.read_csv(csv_file, encoding='ISO-8859-1' )
print(df.columns)
print(df[:1])
# Filter data for New Zealand
nz_hotels = df[df[' countyName'] == 'New Zealand']
nz_hotels[:5]

def preprocess_row(row):
    for key, value in row.items():
        if pd.isna(value):  # Check if the value is NaN
            row[key] = 0  # Replace NaN with 0
        elif isinstance(value, float):
            row[key] = Decimal(str(value))  # Convert floats to Decimals
    return row

# Function to insert a row into DynamoDB
def insert_into_dynamodb(row):
    row = preprocess_row(row) 
    table.put_item(
        Item={
            'hotelId': str(uuid.uuid4()),
            'hotelCode': row[' HotelCode'],
            'countryCode': row['countyCode'],
            'countryName': row[' countyName'],
            'cityCode': row[' cityCode'],
            'cityName': row[' cityName'],
            'HotelName': row[' HotelName'],
            'HotelRating': row[' HotelRating'],
            'Address': row[' Address'],
            'Attractions': row[' Attractions'],
            'Description': row[' Description'],
            'FaxNumber': row[' FaxNumber'],
            'HotelFacilities': row[' HotelFacilities'],
            'Map': row[' Map'],
            'PhoneNumber': row[' PhoneNumber'],
            'pinCode': row[' PinCode'],
            'HotelWebsiteUrl': row[' HotelWebsiteUrl']
        }
    )

# Iterate over each row in the filtered dataframe and insert it into DynamoDB
for index, row in nz_hotels.iterrows():
    insert_into_dynamodb(row)

print("Data imported successfully into DynamoDB.")