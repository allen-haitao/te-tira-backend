import boto3
from uuid import uuid4
from datetime import datetime
from decimal import Decimal

# Initialize the DynamoDB resource
dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-west-2',  # Region name is required but can be anything
    endpoint_url='http://localhost:8000'  # DynamoDB Local endpoint
)

# Initialize the table objects
hotels_table = dynamodb.Table('Hotels')
rooms_table = dynamodb.Table('Rooms')

# Define room types to be added
room_types = [
    {"name": "Single Room", "price_multiplier":Decimal(1)},
    {"name": "Deluxe Room", "price_multiplier": Decimal(1.3)},
    {"name": "Suite Room", "price_multiplier": Decimal(2)}
]

# Scan the Hotels table to get all hotels
response = hotels_table.scan()
hotels = response['Items']

# Iterate over each hotel and add 3 room types
for hotel in hotels:
    hotel_id = hotel['hotelId']
    hotel_price = Decimal(hotel['price']) 

    for room_type in room_types:
        room_type_id = str(uuid4())
        room_name = room_type["name"]
        room_price = hotel_price * room_type["price_multiplier"]

        room_data = {
            'roomTypeId': room_type_id,
            'hotelId': hotel_id,
            'roomTypeName': room_name,
            'price': room_price,
            'total': 10,
            'available': 10,
            'createdAt': datetime.utcnow().isoformat(),
        }

        # Insert the room data into the Rooms table
        rooms_table.put_item(Item=room_data)

        print(f'Added {room_name} to hotel {hotel_id} with roomTypeId {room_type_id}.')

print("All rooms have been added.")