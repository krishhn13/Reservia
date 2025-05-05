document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-reservation-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const bookingId = this.dataset.bookingId;
            const orderContainer = this.closest('.order-container');

            if (confirm(`Are you sure you want to delete reservation #${bookingId}?`)) {
                try {
                    const response = await fetch(`/api/reservations/${bookingId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        // Remove the order container from the DOM
                        if (orderContainer) {
                            orderContainer.remove();

                            // Optionally, update the "No orders yet" message if all are deleted
                            const remainingOrders = document.querySelectorAll('.order-container');
                            if (remainingOrders.length === 0) {
                                const ordersGrid = document.querySelector('.orders-grid');
                                const emptyMessage = document.createElement('p');
                                emptyMessage.classList.add('empty-message');
                                emptyMessage.textContent = 'No orders yet.';
                                ordersGrid.appendChild(emptyMessage);
                            }
                        }
                    } else {
                        const errorData = await response.json();
                        alert(`Failed to delete reservation #${bookingId}: ${errorData.error || 'An error occurred.'}`);
                        console.error('Failed to delete reservation:', response.status, errorData);
                    }
                } catch (error) {
                    alert(`Failed to delete reservation #${bookingId}: ${error.message}`);
                    console.error('Error deleting reservation:', error);
                }
            }
        });
    });
});
