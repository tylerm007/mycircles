import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import CardCreatorDialog from './Card'; // 
import InventoryCalendar from './inventory';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Mobile drag-and-drop support
// We'll use touch events to simulate drag-and-drop for mobile devices

// Utility to detect touch device
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const useMobileDnD = ({
  onDropCard,
  getCardById,
  setDraggingCard,
  draggingCard,
}) => {
  // Attach touch event handlers to card and drop zones
  // onDropCard(card, source, target)
  // getCardById(id)
  // setDraggingCard(card)
  // draggingCard: { card, source }
  const handleTouchStart = (card, source) => (e) => {
    setDraggingCard({ card, source });
    // Optionally highlight drop zones
  };

  const handleTouchEnd = (target) => (e) => {
    if (draggingCard && draggingCard.card && draggingCard.source !== target) {
      onDropCard(draggingCard.card, draggingCard.source, target);
    }
    setDraggingCard(null);
  };

  return { handleTouchStart, handleTouchEnd };
};


const CardDeckManager = () => {
  // Get authentication state and functions
  const { authenticated, loading, login, logout, user, getToken } = useAuth();

  // Initial deck of cards with tags
  const [initialDeck, setInitialDeck] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showInventoryDialog, setShowInventoryDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Success Dialog Component
  const SuccessDialog = () => {
    console.log('Showing success dialog',showSuccessDialog);
    if (!showSuccessDialog) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
            <p className="text-sm text-gray-500 mb-4">Your cards have been saved successfully.</p>
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };
  // Fetch cards from API on component mount
  useEffect(() => {
    // Only fetch cards if user is authenticated
    if (!authenticated) return;

    const fetchCards = async () => {
      try {
        const token = getToken();
        const response = await fetch('http://localhost:5656/get_cards', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const resp = await response.json();
        console.log('Fetched cards:', resp);
        if (response.ok) {
          const cards = resp.cards.map(card => ({
            ...card,
            tags: card.tags || [] // Ensure tags is always an array
          }));
          const red = resp.red.map(red => ({
            ...red,
            tags: red.tags || [] // Ensure tags is always an array
          }));
          const green = resp.green.map(green => ({
            ...green,
            tags: green.tags || [] // Ensure tags is always an array
          }));
          const orange = resp.orange.map(orange => ({
            ...orange,
            tags: orange.tags || [] // Ensure tags is always an array
          }));
          setInitialDeck(cards);
          setDeck(cards); // Initialize deck with fetched cards
          setRedBox(red); // Initialize red box with fetched cards
          setOrangeBox(orange); // Initialize orange box as empty   
          setGreenBox(green); // Initialize green box as empty
          //console,log('AuthProvider getEmail:', AuthProvider.getEmail());
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
        // Fallback to empty array or default cards
        setInitialDeck([]);
        setDeck([]);
      }
    };

    fetchCards();
  }, [authenticated, getToken]);

  const [deck, setDeck] = useState(initialDeck);
  const [redBox, setRedBox] = useState([]);
  const [orangeBox, setOrangeBox] = useState([]);
  const [greenBox, setGreenBox] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Show loading spinner while Keycloak initializes
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full mx-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Three Circles Manager</h1>
          <p className="text-gray-600 mb-6">Please log in to access your card deck manager.</p>
          <button
            onClick={login}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Login with Keycloak
          </button>
        </div>
      </div>
    );
  }
  // Updated addCard function
  const addCard = () => {
    console.log('Opening card dialog');
    setIsDialogOpen(true);
  };

  // Handler for when a new card is saved
  const handleCardSave = (newCard) => {
    console.log('Adding new card to deck:', newCard);
    setDeck(prev => [...prev, newCard]);
  };

  // Handler for closing the dialog
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const inventory = () => {
    console.log('Opening inventory dialog');
    setShowInventoryDialog(true);
  };
  const print = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>My Three Circles</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .card { border: 1px solid #ccc; padding: 10px; margin: 10px; }
              .card h2 { margin: 0 0 10px; }
              .card p { margin: 0; }
            </style>
          </head>
          <body>
            <h1>My Three Circles</h1>
            <h1>Inner Circle</h1>
            <p>Cards in the inner circle describe the behaviors that are considered 'acting-out'.</p>
            <div>
              ${redBox.map(card => `
                <div class="card">
                  <h2>${card.name}</h2>
                  <p>Tags: ${card.tags.join(', ')}</p>
                </div>
              `).join('')}
            </div>
            <h1>Middle Circle</h1>
            <p>Cards in the middle circle are important and should be viewed as relapse warnings.</p>
            <div>
              ${orangeBox.map(card => `
                <div class="card">
                  <h2>${card.name}</h2>
                  <p>Tags: ${card.tags.join(', ')}</p>
                </div>
              `).join('')}
            </div>
            <h1>Outer Circle</h1>
            <p>Cards in the outer circle are the healthy behaviors we engage in daily.</p>
            <div>
              ${greenBox.map(card => `
                <div class="card">
                  <h2>${card.name}</h2>
                  <p>Tags: ${card.tags.join(', ')}</p> 
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      console.error('Failed to open print window');
    }
  };

  const reset = async () => {
    setDeck([]);
    setRedBox([]);
    setOrangeBox([]);
    setGreenBox([]);
    setSearchTerm('');
    try {
      const token = getToken();
      const response = await fetch('http://localhost:5656/reset_cards', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const resp = await response.json();
      console.log('Reset cards:', resp);
      if (response.ok) {
        console.log('Cards reset successfully');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error resetting cards:', error);
    }
  };

  const save = async () => {
    try {
      const cardData = {
        cards: deck,
        red: redBox,
        orange: orangeBox,
        green: greenBox
      };

      const token = getToken();
      const response = await fetch('http://localhost:5656/update_cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        throw new Error('Failed to save cards');
      }

      const resp = await response.json();
      console.log('Save response:', resp);
      console.log('Cards saved successfully');
      setShowSuccessDialog(true)
      SuccessDialog();
    } catch (error) {
      console.error('Error saving cards:', error);
    }
  };

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
      {/* Render SuccessDialog */}
      <SuccessDialog />

      {/* Header with user info and logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Three Circles Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            Welcome, {user?.name || user?.username || 'User'}!
          </span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex justify-between items-center">
        <div className="mb-6 flex">
        <input
          type="text"
          placeholder="Search cards by name or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addCard}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Card
        </button>
        <div>&nbsp;</div>
        <button
          onClick={inventory}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Daily Inventory
        </button>
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={reset}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            onClick={save}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
          <button
            onClick={print}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Print
          </button>
        </div>
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
              Cards{searchTerm ? ` (${filteredDeck.length}/${deck.length} shown)` : ''} ({deck.length})
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
            label="Inner Circle"
            bgColor="drop-zone-red"
            count={redBox.length}
            tooltip="Cards in the inner circle describe the behaviors that are considered 'acting-out'."
          >

            {redBox.map(card => (
              <Card key={card.id} card={card} source="red" />
            ))}

          </DropZone>
          <DropZone
            target="orange"
            label="Middle Circle"
            bgColor="drop-zone-orange"
            count={orangeBox.length}
            tooltip="Cards in the middle circle are important and should be viewed as relapse warnings."
          >

            {orangeBox.map(card => (
              <Card key={card.id} card={card} source="orange" />
            ))}

          </DropZone>
          <DropZone
            target="green"
            label="Outer Circle"
            bgColor="drop-zone-green"
            count={greenBox.length}
            tooltip="Cards in the outer circle are the healthy behaviors we engage in daily."
          >

            {greenBox.map(card => (
              <Card key={card.id} card={card} source="green" />
            ))}

          </DropZone>

        </div>
      </div>
      {/* Card Creator Dialog */}
      <CardCreatorDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleCardSave}
      />
      {/* Inventory Dialog */}
      <InventoryCalendar open={showInventoryDialog} onClose={() => setShowInventoryDialog(false)} />
      {/* Instructions */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        <p>Drag and drop cards between the deck and colored boxes. Use the search bar to filter cards by name or tags.</p>
      </div>
    </div>
  );
};

// Main App component with AuthProvider wrapper
const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CardDeckManager />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;