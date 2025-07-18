import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext.jsx';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface InventoryItem {
    id: number;
    type: string;
    text: string;
    flag: boolean;
}

interface InventoryCalendarProps {
    open: boolean;
    onClose: () => void;
}

const InventoryCalendar: React.FC<InventoryCalendarProps> = ({ open, onClose }) => {
    const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [modal, setModal] = useState<{ open: boolean; isSuccess: boolean; title: string; message: string }>({ open: false, isSuccess: true, title: '', message: '' });
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const { getToken } = useAuth();

    useEffect(() => {
        setError(null);
        setSuccess(null);
    }, [date]);

    const showModal = (isSuccess: boolean, title: string, message: string) => {
        setModal({ open: true, isSuccess, title, message });
    };

    const closeModal = () => {
        setModal({ ...modal, open: false });
    };

    const fetchInventory = async () => {
        if (!date) {
            setError('Please select a date');
            return;
        }
        setSelectedDate(date);
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const token = await getToken();
            const response = await fetch('http://localhost:5656/load_inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ date })
            });
            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
            const data: InventoryItem[] = await response.json();
            setInventory(data);
        } catch (err: any) {
            setError(`Error fetching inventory: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const updateFlag = (id: number, checked: boolean) => {
        setInventory(prev => prev.map(item => item.id === id ? { ...item, flag: checked } : item));
    };

    const saveInventory = async () => {
        if (!selectedDate || inventory.length === 0) {
            showModal(false, 'No Data', 'No inventory data to save');
            return;
        }
        setLoading(true);
        try {
            const token = await getToken();
            const response = await fetch('http://localhost:5656/update_inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ date: selectedDate, inventory })
            });
            if (response.ok) {
                showModal(true, 'Save Successful', 'Your inventory changes have been saved successfully!');
            } else {
                let errorMessage = `Server responded with status ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    try {
                        const errorText = await response.text();
                        if (errorText) { errorMessage = errorText; }
                    } catch { console.log('Failed to parse error response'); }
                }
                showModal(false, 'Save Failed', errorMessage);
            }
        } catch (err: any) {
            showModal(false, 'Connection Error', `Failed to save inventory: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Group inventory by type
    const groupedInventory = inventory.reduce<Record<string, InventoryItem[]>>((acc, item) => {
        if (!acc[item.type]) { acc[item.type] = []; }
        acc[item.type].push(item);
        return acc;
    }, {});

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false} PaperProps={{ style: { width: 810, maxWidth: '95vw' } }}>
            <div className="container" style={{ margin: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <h1 className="inventory-calendar-title">📅 Daily Inventory Checklist</h1>
                    <style>
                    {`
                    .inventory-calendar-title {
                        margin: 0;
                        font-weight: bold;
                        font-size: 20pt;
                    }
                    `}
                    </style>
                    <h1 style={{ fontSize: '18pt' }}>Select Inventory Date</h1>
                    <div className="date-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 8 }}>
            
                        <input
                            type="date"
                            className="date-input"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') fetchInventory(); }}
                        />
                        <button
                            onClick={fetchInventory}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                        >
                            Load Inventory
                        </button>
                    </div>
                </div>
                {loading && <div className="loading">Loading inventory data...</div>}
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                {inventory.length > 0 && (
                    <div id="inventorySection" className="inventory-section">
                        <h2 className="inventory-date" style={{ textAlign: 'center', marginBottom: 16 }}>Enter your activities and reflections for {selectedDate}</h2>
                        <div>&nbsp;</div>
                        <div id="inventoryData">
                            {Object.keys(groupedInventory).map(type => (
                                <div className="type-group" key={type} style={{ border: '2px solid #667eea', borderRadius: 8, marginBottom: 20, padding: 16, background: '#f8fafc', width: 770, marginLeft: 'auto', marginRight: 20 }}>
                                    <h2 className="type-header" style={{ fontWeight: 'bold', textAlign: 'center' }}>{type} Circle</h2>
                                    {groupedInventory[type].map(item => (
                                        <div className="inventory-item" key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                                            <div className="item-text" style={{ flex: 1 }}>{item.text}</div>
                                            <Button
                                                variant={item.flag ? "contained" : "outlined"}
                                                color={item.flag ? "success" : "inherit"}
                                                onClick={() => updateFlag(item.id, !item.flag)}
                                                style={{ marginLeft: 'auto', minWidth: 80 }}
                                            >
                                                {item.flag ? "Yes" : "No"}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="save-section" style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={saveInventory}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
                {/* Modal Dialog */}
                <Dialog open={modal.open} onClose={closeModal} aria-labelledby="modal-title" aria-describedby="modal-message">
                    <DialogTitle id="modal-title" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span className={`modal-icon ${modal.isSuccess ? 'success-icon' : 'error-icon'}`} style={{ fontSize: 32, marginRight: 12 }}>{modal.isSuccess ? '✅' : '❌'}</span>
                        <span style={{ color: modal.isSuccess ? '#48bb78' : '#e53e3e' }}>{modal.title}</span>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="modal-message">{modal.message}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeModal} variant="contained" color={modal.isSuccess ? 'success' : 'error'}>OK</Button>
                    </DialogActions>
                </Dialog>
                <DialogActions style={{ justifyContent: 'center', display: 'flex', width: '100%' }}>
                    <Button onClick={onClose} color="primary" variant="outlined">Close</Button>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default InventoryCalendar;
