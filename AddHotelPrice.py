import boto3

# Initialize the DynamoDB client for DynamoDB Local
dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-west-2',  # Region name is required but can be anything
    endpoint_url='http://localhost:8000'  # DynamoDB Local endpoint
)
table = dynamodb.Table('Hotels')

def calculate_price(hotel_rating):
    """Calculate the price based on the hotel rating."""
    if hotel_rating == 0:
        return 99
    return (hotel_rating * 100) - 1

def update_hotel_price(hotel):
    """Update the price of a hotel item in DynamoDB."""
    hotel_id = hotel['hotelId']
    rating = 0
    hotel_rating = hotel.get('HotelRating')
    if hotel_rating == 'TwoStar':
        rating = 2
    elif hotel_rating == 'ThreeStar':
        rating = 3
    elif hotel_rating == 'FourStar':
        rating = 4
    elif hotel_rating == 'FiveStar':
        rating = 6
    else:
        rating = 0
    price = calculate_price(rating)

    # Update the hotel item with the calculated price
    table.update_item(
        Key={'hotelId': hotel_id},
        UpdateExpression='SET price = :price',
        ExpressionAttributeValues={
            ':price': price
        }
    )

    print(f"Updated hotel {hotel['HotelName']} (ID: {hotel_id}) with price {price}.")

def update_all_hotels():
    """Scan all hotels and update their price based on the rating."""
    response = table.scan()
    hotels = response['Items']

    for hotel in hotels:
        update_hotel_price(hotel)

    # Handle pagination if there are more items
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        hotels = response['Items']
        for hotel in hotels:
            update_hotel_price(hotel)

def main():
    update_all_hotels()

if __name__ == "__main__":
    main()