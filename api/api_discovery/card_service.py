from flask import request, jsonify
import logging
from database import models  # Import your models here
import safrs
import csv
import os
from flask_jwt_extended import jwt_required
from datetime import datetime

app_logger = logging.getLogger(__name__)

db = safrs.DB 
session = db.session 

def add_service(app, api, project_dir, swagger_host: str, PORT: str, method_decorators = []):
    pass

    @app.route('/hello_service')
    def hello_service():
        """        
        Illustrates:
        * Use standard Flask, here for non-database endpoints.

        Test it with:
        
                http://localhost:5656/hello_service?user=ApiLogicServer
        """
        user = request.args.get('user')
        app_logger.info(f'{user}')
        return jsonify({"result": f'hello from new_service! from {user}'})
    
    def getCardSelection(card_selection, card_id):
        """
        Illustrates:    
        Get the circle type for a given card ID.
        """
        for selection in card_selection:
            if selection.card_id == card_id:
                return selection.circle_type
        return "Unknown Circle"
    
    def getCardSelection(card_selection, card_id):
        """
        Illustrates:    
        Get the circle type for a given card ID.
        """
        for selection in card_selection:
            if selection.card_id == card_id:
                return selection.circle_type
        return "Unknown Circle"
    
    def getCardText(cards,card_id) -> str:
        """
        Illustrates:    
        Get the card text for a given card ID.
        """
        for card in cards:
            if card.id == card_id:
                return card.circle_text
        return "Unknown Card"
    
    def create_inventory(user_id, date):
        """
        Illustrates:    
        Create an inventory record for a specific date.
        curl -X POST http://localhost:5656/create_inventory -H "Content-Type: application/json" -d '{"date": "2023-10-01"}'
        """
        parent = session.query(models.DailyResponseCount).filter_by(user_id=user_id, response_date=date).first()
        if not parent:
            date_obj = datetime.strptime(date, '%Y-%m-%d').date()
            parent = models.DailyResponseCount(user_id=user_id, response_date=date_obj)
            #parent = models.DailyResponseCount(user_id=user_id, response_date=date)
            session.add(parent)
            session.commit()
            session.flush()
            app_logger.info(f'Created DailyResponseCount for user {user_id} on {date}')
        inventory = []
        card_selection = session.query(models.CardSelection)\
            .filter(models.CardSelection.user_id == user_id) \
            .all()
        if not card_selection:
            app_logger.info('No card selections found')
            return jsonify({"error": "No card selections found"}), 404
        cards = session.query(models.Card).all()    
        for card in card_selection:
            # create an array of items from card_selection
            card_id = card.card_id  # Example card ID, replace with actual logic to get card ID
            card_text = getCardText(cards,card_id)  # Example card text, replace with actual logic to
            #response = models.Response(user_id=user_id, card_id=card_id, response_date=date, response_text=card_text, response_bool=False, response_range=0)
            response = {"id": card_id, "text": card_text, "flag": False, "type": card.circle_type}
            inventory.append(response)  # Assuming to_dict() method exists in Response model
        app_logger.info(f'Created initial inventory for date: {date}')
        return inventory
    
    @app.route('/update_inventory', methods=['POST', 'OPTIONS'])
    @jwt_required()
    def update_inventory():
        if request.method == 'OPTIONS':
            return jsonify({"message": "CORS preflight response"}), 200
        payload = request.json
        user_id = get_user_id()
        date = payload.get('date', None)
        inventory = payload.get('inventory', [])
        if not date or not inventory:
            return jsonify({"error": "Date and inventory are required"}), 400
        # Update the inventory in the database
        for item in inventory:
            card_id = item.get('id')
            card_text = item.get('text')
            card_flag = item.get('flag')
            card_type = item.get('type')
            # Update the card in the database
            date_obj = datetime.strptime(date, '%Y-%m-%d').date()
            response = session.query(models.Response).filter_by(user_id=user_id, card_id=card_id, response_date=date).first() \
                or models.Response(user_id=user_id, card_id=card_id, response_date=date_obj)
            response.response_bool = card_flag
            response.response_range = 0
            response.circle_type = card_type
            session.add(response)
            app_logger.info(f'Updating daily response inventory for user {user_id} on {date} using: {item}')
            session.commit()
        return jsonify({"message": "Inventory Updated"}), 200

    @app.route('/load_inventory', methods=['POST', 'OPTIONS'])
    @jwt_required()
    def load_inventory():
        """
        Illustrates:    
        Get the current date and time for inventory purposes.
        curl -X POST http://localhost:5656/inventory_date
        
        
        
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        user_id = Column(ForeignKey('users.id'))
        card_id = Column(ForeignKey('card_selection.id'))
        response_date = Column(Date, server_default=text("CURRENT_TIMESTAMP"), nullable=False)
        circle_type = Column(String(20))
        response_text = Column(Text)
        response_bool = Column(Boolean)
        response_range = Column(Integer)
        
        """
        if request.method == 'OPTIONS':
            return jsonify({"message": "CORS preflight response"}), 200
        payload = request.json
        date = payload.get('date', None)
        if not date:
            app_logger.error('No date provided in payload')
            return jsonify({"error": "No date provided"}), 400
        
        user_id = get_user_id()
        
        app_logger.info(f'Inventory date request with payload: {payload}')
        card_selection = session.query(models.CardSelection).all()
        if not card_selection:
            app_logger.info('No card selections found')
            return jsonify({"error": "No card selections found"}), 404
        inventory = session.query(models.Response) \
            .filter(models.Response.response_date == date) \
            .filter(models.Response.user_id == user_id) \
            .all()
        if not inventory:
            inventory = create_inventory(user_id,date)
            return jsonify(inventory), 201
        cards = session.query(models.Card).all()
        if not cards:
            app_logger.info('No cards found')
            return jsonify({"error": "No cards found"}), 404
        data =[]
        for card in inventory:
            card_text = getCardText(cards, card.card.id)
            circle_type = getCardSelection(card_selection, card.card_id)
            row = {"id": card.card_id, "text": card_text, "flag": card.response_bool, "type": circle_type}
            data.append(row)

        return jsonify(data), 200
    
    @app.route('/new_card', methods=['POST','OPTIONS'])
    @jwt_required()
    def new_card():
        
        """
        Illustrates:    
        Create a new card
        curl -X POST http://localhost:5656/new_card -H "Content-Type: application/json" -d '{"circleText": "New Card", "fellowship": "SAA", "tags": ["tag1", "tag2"]}'
        """
        if request.method == 'OPTIONS':
            return jsonify({"message": "CORS preflight response"}), 200
        
        data = request.json
        app_logger.info(f'Creating new card with data: {data}')
        
        if not data or 'fellowship' not in data:
            return jsonify({"error": "Invalid data"}), 400
        try:
            new_card = session.query(models.Card).filter_by(circle_text=data['circleText'], fellowship_name=data['fellowship']).first()
            if new_card is None:
                new_card = models.Card(circle_text=data['circleText'], fellowship_name=data['fellowship'], card_type='free', is_active=True)
                session.add(new_card)
                session.commit()
                session.flush()
    
            # Ensure the new card has an ID before proceeding
            # Add tags if provided
            if 'tags' in data:
                tag_list = data['tags'].split(',') if isinstance(data['tags'], str) else data['tags']
                for tag_name in tag_list:
                    tag = session.query(models.Tag).filter_by(tag_name=tag_name.strip(), fellowship_name=data['fellowship']).first()
                    if not tag:
                        tag = models.Tag(tag_name=tag_name.strip(), fellowship_name=data['fellowship'])
                        session.add(tag)
                        session.commit()
                    card_tag = models.CardTag(card_id=new_card.id, tag_id=tag.id)
                    session.add(card_tag)
            
            session.commit()
            app_logger.info(f'New card created with ID: {new_card.id}')
    
        except Exception as e:
            session.rollback()
            app_logger.error(f'Error creating card: {e}')
            return jsonify({"error": "Failed to create card"}), 500
        
        return jsonify({"status": "success", "message": "Card created successfully", "card_id": new_card.id}), 201
 
    @app.route('/update_cards', methods=['POST'])
    @jwt_required()
    def update_cards():
        '''
        Illustrates: save selection
            'cards' =[{'id': 4, 'name': 'Go for a walk', 'tags': [...]}]
            'red' = [{'id': 3, 'name': 'Attend an SAA meeting', 'tags': [...]}]
            'orange' = []
            'green' = []
            
            truncate models.CardSelection
            insert into models.CardSelection (user_id, card_id, circle_type, selected_date)
            values (1, 4, 'inner', '2023-10-01')
            values (1, 3, 'middle', '2023-10-01')
            values (1, 4, 'outer', '2023-10-01')
        '''
        data = request.json
        auth_header = request.headers.get("Authorization")
        user_id = get_user_id()
        # token now contains the Bearer token string (decode as needed)
        app_logger.info(f'Updating cards with data: {data}')
        inner = data.get('red', [])
        middle = data.get('orange', [])
        outer = data.get('green', [])
        session.query(models.CardSelection).filter_by(user_id=user_id).delete()
        for card in inner:
            session.add(models.CardSelection(user_id=user_id, card_id=card['id'], circle_type='Inner'))
        for card in middle:
            session.add(models.CardSelection(user_id=user_id, card_id=card['id'], circle_type='Middle'))
        for card in outer:
            session.add(models.CardSelection(user_id=user_id, card_id=card['id'], circle_type='Outer'))
        session.commit()
        app_logger.info('Cards updated successfully')
        return jsonify({"status": "success", "message": "Cards updated successfully"}), 200
    
    @app.route('/get_cards', methods=['GET'])
    @jwt_required()
    def get_cards():
        """
        Illustrates:    
        # This is a placeholder for the actual logic to retrieve cards.
        # In a real application, you would query your database or data source here.
        cards = [
            {"id": 1, "name": "Ace of Hearts", "tags": ["heart", "ace", "red"]},
            {"id": 2, "name": "King of Spades", "tags": ["spade", "king", "black", "face"]},
            {"id": 3, "name": "Queen of Diamonds", "tags": ["diamond", "queen", "red", "face"]},
            {"id": 4, "name": "Jack of Clubs", "tags": ["club", "jack", "black", "face"]},
            {"id": 5, "name": "10 of Hearts", "tags": ["heart", "ten", "red", "number"]},
            {"id": 6, "name": "9 of Spades", "tags": ["spade", "nine", "black", "number"]},
            {"id": 7, "name": "8 of Diamonds", "tags": ["diamond", "eight", "red", "number"]},
            {"id": 8, "name": "7 of Clubs", "tags": ["club", "seven", "black", "number"]},
            {"id": 9, "name": "6 of Hearts", "tags": ["heart", "six", "red", "number"]},
            {"id": 10, "name": "5 of Spades", "tags": ["spade", "five", "black", "number"]},
            {"id": 11, "name": "4 of Diamonds", "tags": ["diamond", "four", "red", "number"]},
            {"id": 12, "name": "3 of Clubs", "tags": ["club", "three", "black", "number"]},
            {"id": 13, "name": "2 of Hearts", "tags": ["heart", "two", "red", "number"]},
            {"id": 14, "name": "Ace of Spades", "tags": ["spade", "ace", "black"]},
            {"id": 15, "name": "Joker", "tags": ["joker", "wild", "special"]}
        ]
        
            'cards' =[{'id': 4, 'name': 'Go for a walk', 'tags': [...]}]
            'red' = [{'id': 3, 'name': 'Attend an SAA meeting', 'tags': [...]}]
            'orange' = []
            'green' = []
            return {"cards": cards, "red": [], "orange": [], "green": []}
        """
    
        cards = session.query(models.Card).filter(models.Card.is_active == True).all()
        tags = session.query(models.Tag).all()
        card_tags = session.query(models.CardTag).all()
        for card in cards:
            card.tags = [tag.tag_name for tag in tags if tag.id in [ct.tag_id for ct in card_tags if ct.card_id == card.id]]
        # Convert to a list of dictionaries for JSON serialization
        # Get selected card IDs for each circle type
        user_id = get_user_id()
        card_selections = session.query(models.CardSelection).filter_by(user_id=user_id).all()
        selected_inner_ids = {cs.card_id for cs in card_selections if cs.circle_type == 'Inner'}
        selected_middle_ids = {cs.card_id for cs in card_selections if cs.circle_type == 'Middle'}
        selected_outer_ids = {cs.card_id for cs in card_selections if cs.circle_type == 'Outer'}
        
        # Get all selected card IDs
        all_selected_ids = selected_inner_ids | selected_middle_ids | selected_outer_ids
        
        # Filter out selected cards from the main cards list
        available_cards = [{"id": card.id, "name": card.circle_text, "tags": card.tags} for card in cards if card.id not in all_selected_ids]
        
        # Create lists of selected cards for each circle
        red = [{"id": card.id, "name": card.circle_text, "tags": card.tags} for card in cards if card.id in selected_inner_ids]
        orange = [{"id": card.id, "name": card.circle_text, "tags": card.tags} for card in cards if card.id in selected_middle_ids]
        green = [{"id": card.id, "name": card.circle_text, "tags": card.tags} for card in cards if card.id in selected_outer_ids]
        
        cards = available_cards
        # For now, returning empty lists for red, orange, and green
        return jsonify({"cards": cards, "red": red, "orange": orange, "green": green})
    
    @app.route('/reset_cards', methods=['GET'])
    @jwt_required()
    def reset_cards():
        user_id = get_user_id()
        session.query(models.CardSelection).filter_by(user_id=user_id).delete()
        session.commit()
        app_logger.info('Card selections reset successfully')
        return jsonify({"status": "success", "message": "Card selections reset successfully"}), 200
        
    @app.route('/load_cards', methods=['GET'])
    def load_cards():
        """ 
        Illustrates:    
        Load initial deck of cards from named csv file
        curl http://localhost:5656/load_cards?file_name=outer_circles.csv
        curl http://localhost:5656/load_cards?file_name=inner_circles.csv
        """
        file_name = request.args.get ("file_name", "circles.csv")
        app_logger.info(f'Loading cards with data: {file_name}')
        initial_deck = []
        try:
            # Construct the full file path (assuming CSV files are in a 'data' directory)
            file_path = os.path.join(project_dir,  file_name)
            
            # Check if file exists
            if not os.path.exists(file_path):
                app_logger.error(f'File not found: {file_path}')
                return jsonify({"error": f"File {file_name} not found"}), 404
            
            
            with open(file_path, 'r', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row_num, row in enumerate(reader, start=1):
                    try:
                        # Parse tags if they exist, assuming comma-separated values in a 'tags' column
                        tags = row.get('Tags', '').split(',') if row.get('Tags') else []
                        tags = [tag.strip() for tag in tags if tag.strip()]  # Clean up whitespace
                        
                        card = {
                            "id": int(row.get('id', row_num)),
                            "name": row.get('Name', '').strip(),
                            "tags": tags
                        }
                        initial_deck.append(card)
                    except (ValueError, KeyError) as e:
                        app_logger.warning(f'Error parsing row {row_num}: {e}')
                        continue
            
            app_logger.info(f'Successfully loaded {len(initial_deck)} cards from {file_name}')

        except Exception as e:
            app_logger.error(f'Error loading cards from {file_name}: {e}')
            return jsonify({"error": f"Failed to load cards: {str(e)}"}), 500
        '''
        {
            "id": 23,
            "name": "Dancing",
            "tags": [
                "Fun"
            ]
        },
        '''
        
        for tag in initial_deck:
            for tag_name in tag['tags']:
                existing_tag = session.query(models.Tag).filter_by(tag_name=tag_name, fellowship_name='SAA').first()
                if not existing_tag:
                    new_tag = models.Tag(tag_name=tag_name, fellowship_name='SAA')
                    session.add(new_tag)
                    session.commit()
                    app_logger.info(f'Added new tag: {tag_name}')
                else:
                    app_logger.info(f'Tag already exists: {tag_name}')
        for card in initial_deck:
            existing_card = session.query(models.Card).filter_by(circle_text=card['name'], fellowship_name='SAA').first()
            if not existing_card:
                new_card = models.Card(circle_text=card['name'], fellowship_name='SAA', card_type='free' ,is_active=True)
                session.add(new_card)
                session.commit()
                app_logger.info(f'Added new card: {card["name"]}')
            else:
                app_logger.info(f'Card already exists: {card["name"]}') 
        user_id = get_user_id()
        session.query(models.CardSelection).filter(models.CardSelection.user_id == user_id).delete()
        #session.query(models.CardTag).delete()
        all_cards = session.query(models.Card).all()
        all_tags = session.query(models.Tag).all()
        for card in all_cards:
            card_id = card.id
            for initial_card in initial_deck:   
                if card.circle_text == initial_card['name']:
                    for tag_name in initial_card['tags']:
                        tag = session.query(models.Tag).filter_by(tag_name=tag_name, fellowship_name='SAA').first()
                        if tag:
                            card_tag = models.CardTag(card_id=card_id, tag_id=tag.id)
                            session.add(card_tag)
                            app_logger.info(f'Added CardTag: {card.circle_text} - {tag.tag_name}')
            session.commit()
        # Return the initial deck as a JSON response
        app_logger.info(f'Initial deck loaded with {len(initial_deck)} cards')
        return jsonify({"initialDeck": initial_deck})
    
    def  get_user_id():
        """ 
        Illustrates:    
        Get the user ID from the JWT token
        
        # Assuming you have a way to get the current user from the JWT token
        # This is a placeholder function; implement your logic to extract user ID
        """
        from security.system.authorization import Security
        user_info = Security.current_user()
        user = session.query(models.Users).filter_by(name=user_info['name']).first()
        if user is None:
            app_logger.warning('User not found')
            user = models.Users(name=user_info['name'], fellowship_name='SAA', email=user_info['name']) #TODO
            session.add(user)
            session.commit()
            app_logger.info(f'Created new user: {user.name}')
            # If you want to return None when user is not found, uncomment the next line
            session.flush()
        
        return user.id