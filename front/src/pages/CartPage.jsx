import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalMessage from '../components/ModalMessage';
import { Link } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkout, setCheckout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [modal, setModal] = useState({ show: false, title: '', message: '' });
  const closeModal = () => setModal({ show: false, title: '', message: '' });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
      setLoading(false);
    } catch (error) {
      setModal({ show: true, title: 'Помилка', message: 'Не вдалося завантажити кошик' });
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModal({ show: true, title: 'Інформація', message: 'Товар видалено з кошика' });
      fetchCart();
    } catch (error) {
      setModal({ show: true, title: 'Помилка', message: 'Не вдалося видалити товар' });
    }
  };

  const handleCheckout = () => {
    setCheckout(true);
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setProcessing(true);
    // Імітуємо процес оформлення та оплати (реалістичніше)
    setTimeout(async () => {
      // Створюємо замовлення на сервері (імітація)
      const token = localStorage.getItem('token');
      try {
        await axios.post('http://localhost:5000/api/orders/create', {
          deliveryAddress,
          phoneNumber,
          paymentMethod
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setModal({ show: true, title: 'Успіх', message: paymentMethod === 'card'
          ? 'Замовлення оформлено, оплата карткою пройшла успішно!'
          : 'Замовлення оформлено, оплатіть готівкою при доставці!' });
        // Очистка кошика (імітація)
        setCart({ items: [] });
      } catch (error) {
        setModal({ show: true, title: 'Помилка', message: 'Не вдалося оформити замовлення' });
      }
      setProcessing(false);
      setCheckout(false);
      setDeliveryAddress('');
      setPhoneNumber('');
      setPaymentMethod('card');
    }, 3000);
  };

  if (loading) return <div className="cart-container">Завантаження...</div>;
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <ModalMessage show={modal.show} onClose={closeModal} title={modal.title} message={modal.message} />
        <p>Кошик порожній</p>
      </div>
    );
  }

  const totalSum = cart.items.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);

  return (
    <div className="cart-container">
      <ModalMessage show={modal.show} onClose={closeModal} title={modal.title} message={modal.message} />
      <h2 className="cart-title">Мій кошик</h2>
      <div className="cart-items-list">
        {cart.items.map(item => (
          <div key={item._id} className="cart-item">
            <div className="cart-item-details">
              {item.product?.imagePath ? (
                <img src={`http://localhost:5000/${item.product.imagePath}`} alt={item.product.name} className="cart-item-image" />
              ) : (
                <div className="cart-no-image">(Немає фото)</div>
              )}
              <div className="cart-item-info">
                <p className="item-name">{item.product?.name}</p>
                <p className="item-price">Ціна: ${item.product?.price}</p>
                <p className="item-quantity">Кількість: {item.quantity}</p>
              </div>
            </div>
            <button className="delete-btn" onClick={() => handleRemove(item.product._id)}>Видалити</button>
          </div>
        ))}
      </div>
      <div className="total-sum">
        <strong>Загальна сума:</strong> ${totalSum.toFixed(2)}
      </div>
      {!checkout && (
        <button className="checkout-btn" onClick={handleCheckout}>Оформити замовлення</button>
      )}
      {checkout && (
        <form className="checkout-form" onSubmit={handleConfirmOrder}>
          <h3>Дані для доставки та оплати</h3>
          <label>Адреса доставки:</label>
          <input type="text" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} required />
          <label>Номер телефону:</label>
          <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
          <label>Спосіб оплати:</label>
          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="card">Карткою</option>
            <option value="cash">Готівкою</option>
          </select>
          <button type="submit" className="confirm-order-btn" disabled={processing}>
            {processing ? 'Обробка...' : 'Підтвердити замовлення'}
          </button>
        </form>
      )}
    </div>
  );
}

export default CartPage;
