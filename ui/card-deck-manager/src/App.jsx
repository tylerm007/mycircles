import React, { useState, useEffect } from 'react';

const CardDeckManager = () => {
  // Initial deck of cards with tags
  const [initialDeck, setInitialDeck] = useState([]);

  // Fetch cards from API on component mount
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:5656/get_cards');
        const cards = await response.json();
        setInitialDeck(cards);
        setDeck(cards); // Initialize deck with fetched cards
      } catch (error) {
        console.error('Error fetching cards:', error);
        // Fallback to empty array or default cards
        setInitialDeck([]);
        setDeck([]);
      }
    };

    fetchCards();
  }, []);

  const [deck, setDeck] = useState(initialDeck);
  const [redBox, setRedBox] = useState([]);
  const [orangeBox, setOrangeBox] = useState([]);
  const [greenBox, setGreenBox] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter cards based on search term
  const filteredDeck = deck.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDragStart = (e, card, source) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ card, source }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, target) => {
    e.preventDefault();

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { card, source } = data;

      if (source === target) return; // Don't move to same location

      // Remove from source
      switch (source) {
        case 'deck':
          setDeck(prev => prev.filter(c => c.id !== card.id));
          break;
        case 'red':
          setRedBox(prev => prev.filter(c => c.id !== card.id));
          break;
        case 'orange':
          setOrangeBox(prev => prev.filter(c => c.id !== card.id));
          break;
        case 'green':
          setGreenBox(prev => prev.filter(c => c.id !== card.id));
          break;
      }

      // Add to target
      switch (target) {
        case 'deck':
          setDeck(prev => [...prev, card]);
          break;
        case 'red':
          setRedBox(prev => [...prev, card]);
          break;
        case 'orange':
          setOrangeBox(prev => [...prev, card]);
          break;
        case 'green':
          setGreenBox(prev => [...prev, card]);
          break;
      }
    } catch (error) {
      console.error('Error in drag and drop:', error);
    }
  };

  const Card = ({ card, source }) => (
    <div
      draggable={true}
      onDragStart={(e) => handleDragStart(e, card, source)}
      className="bg-white border-2 border-gray-300 rounded-lg p-3 mb-2 cursor-move hover:shadow-lg transition-shadow duration-200 hover:border-blue-400 select-none"
      style={{ userSelect: 'none' }}
    >
      <div className="font-semibold text-gray-800 mb-1">{card.name}</div>
      <div className="flex flex-wrap gap-1">
        {card.tags.map(tag => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const DropZone = ({ children, target, label, bgColor, count }) => (
    <div
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, target)}
      className={`${bgColor} border-2 border-dashed border-gray-700 rounded-lg p-4 overflow-y-auto flex-1 flex-col`}
      style={{ minHeight: '500px' }}
    >
      <div className="font-bold text-lg mb-4 text-center sticky top-0 bg-opacity-90 backdrop-blur-sm rounded px-2 py-1" style={{ backgroundColor: 'inherit' }}>
        {label} ({count})
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Three Circles Manager</h1>

      {/* Search Bar */}
      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search cards by name or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-6 h-screen max-h-screen">
        {/* Deck Section */}
        <div className="w-1/2 h-full flex flex-col">
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'deck')}
            className="bg-blue-50 border-2 border-dashed border-gray-400 rounded-lg p-8 h-full flex-1 max-h-full overflow-y-auto flex flex-col"
            style={{ minHeight: 0 }}
          >
            <div className="font-bold text-lg mb-8 text-center sticky top-0 bg-blue-50 bg-opacity-90 backdrop-blur-sm rounded px-4 py-2 text-blue-700">
              Deck{searchTerm ? ` (${filteredDeck.length}/${deck.length} shown)` : ''} ({deck.length})
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto text-blue-700">
              {filteredDeck.map(card => (
                <Card key={card.id} card={card} source="deck" />
              ))}
            </div>
          </div>
        </div>

        {/* Three Boxes Section */}
        <div className="w-1/2 flex gap-6 h-screen max-h-screen overflow-y-auto flex-col">

          <DropZone
            target="red"
            label="Inner"
            bgColor="drop-zone-red"
            count={redBox.length}
          >

            {redBox.map(card => (
              <Card key={card.id} card={card} source="red" />
            ))}

          </DropZone>
          <DropZone
            target="orange"
            label="Middle"
            bgColor="drop-zone-orange"
            count={orangeBox.length}
          >

            {orangeBox.map(card => (
              <Card key={card.id} card={card} source="orange" />
            ))}

          </DropZone>
          <DropZone
            target="green"
            label="Outer"
            bgColor="drop-zone-green"
            count={greenBox.length}
          >

            {greenBox.map(card => (
              <Card key={card.id} card={card} source="green" />
            ))}

          </DropZone>

        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        <p>Drag and drop cards between the deck and colored boxes. Use the search bar to filter cards by name or tags.</p>
      </div>
    </div>
  );
};

export default CardDeckManager;