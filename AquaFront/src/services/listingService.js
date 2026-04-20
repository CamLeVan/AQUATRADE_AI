import api from './api';

/**
 * @typedef {Object} ListingDTO
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} pricePerFish - Giá tiền mỗi con cá (Backend DTO)
 * @property {number} availableQuantity - Số lượng tồn kho
 * @property {string[]} images - Mảng URL hình ảnh
 * @property {number} healthScore - Điểm sức khỏe AI
 * @property {string} location - Địa điểm
 */

/**
 * Lấy danh sách sản phẩm trên chợ
 * @param {Object} params - Search params (title, minPrice, maxPrice)
 * @returns {Promise<ListingDTO[]>}
 */
export const getListings = async (params) => {
  try {
    const response = await api.get('/listings', { params });
    return response.data.data; // Giả định cấu trúc { status: 'success', data: [...] }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Lấy chi tiết một sản phẩm
 * @param {string} id 
 * @returns {Promise<ListingDTO>}
 */
export const getListingById = async (id) => {
  try {
    const response = await api.get(`/listings/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Đăng tin bán hàng mới (Dành cho SELLER)
 * @param {ListingDTO} listingData 
 */
export const createListing = async (listingData) => {
  try {
    const response = await api.post('/listings', listingData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
