import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalMessage from '../components/ModalMessage';
import './HomePage.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  const [modal, setModal] = useState({ show: false, title: '', message: '' });
  const closeModal = () => setModal({ show: false, title: '', message: '' });

  // Зчитування ролі з localStorage
  const [role, setRole] = useState('');
  useEffect(() => {
    const r = localStorage.getItem('role') || '';
    setRole(r);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        params: { search, category: categoryFilter }
      });
      setProducts(res.data);

      // Отримуємо список всіх категорій для фільтрації
      const allRes = await axios.get('http://localhost:5000/api/products');
      const allProducts = allRes.data;
      const catSet = new Set();
      allProducts.forEach(p => {
        if (p.category) catSet.add(p.category);
      });
      setCategories(Array.from(catSet));
    } catch (error) {
      setModal({ show: true, title: 'Помилка', message: 'Не вдалося завантажити товари' });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter]);

  // Додавання товару до кошика (тільки для звичайних користувачів)
  const addToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setModal({ show: true, title: 'Інформація', message: 'Спочатку увійдіть або зареєструйтесь' });
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        productId,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModal({ show: true, title: 'Успіх', message: 'Товар додано до кошика!' });
    } catch (error) {
      setModal({ show: true, title: 'Помилка', message: 'Не вдалося додати товар у кошик' });
    }
  };

  return (
    <div className="home-page">
      <ModalMessage show={modal.show} onClose={closeModal} title={modal.title} message={modal.message} />
      <h1 className="site-title">Edems</h1>
      <p className="site-description">
        Тут можна знайти все необхідне для догляду за шкірою та макіяжу!
      </p>
      <div className="filter-section">
        <input
          type="text"
          placeholder="Пошук..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">Усі категорії</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="home-catalog">
        {products.map(prod => (
          <div key={prod._id} className="home-product-card">
            <h3>{prod.name}</h3>
            {prod.imagePath ? (
              <img src={`http://localhost:5000/${prod.imagePath}`} alt={prod.name} className="home-product-image" />
            ) : (
              <div className="no-image-box">(Немає фото)</div>
            )}
            <p className="price-label">Ціна: ${prod.price}</p>
            <p className="category-label">{prod.category}</p>
            <p className="description">{prod.description}</p>
            {/* Кнопка "В кошик" з'являється лише якщо користувач не є адміном */}
            {role !== 'admin' && (
              <button className="add-to-cart-btn" onClick={() => addToCart(prod._id)}>
                В кошик
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
