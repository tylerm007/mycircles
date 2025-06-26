from flask import request, jsonify
import logging

import safrs
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
    @app.route('/update_cards', methods=['POST'])
    def update_cards():
        ''''
        Illustrates: save selection
            'cards' =[{'id': 4, 'name': 'Go for a walk', 'tags': [...]}]
            'red' = [{'id': 3, 'name': 'Attend an SAA meeting', 'tags': [...]}]
            'orange' = []
            'green' = []
        '''
        data = request.json
        app_logger.info(f'Updating cards with data: {data}')
        return jsonify({"status": "success", "message": "Cards updated successfully"}), 200
    @app.route('/get_cards', methods=['GET'])
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
        from database import models  # Import your models here
        cards = session.query(models.Card).all()
        tags = session.query(models.Tag).all()
        card_tags = session.query(models.CardTag).all()
        for card in cards:
            card.tags = [tag.tag_name for tag in tags if tag.id in [ct.tag_id for ct in card_tags if ct.card_id == card.id]]
        # Convert to a list of dictionaries for JSON serialization
        cards = [{"id": card.id, "name": card.circle_text, "tags": card.tags} for card in cards]
        return jsonify({"cards": cards, "red": [], "orange": [], "green": []})