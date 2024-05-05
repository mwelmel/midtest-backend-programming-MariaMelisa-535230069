const productsRepository = require('./product-repository');

/**
 * sebuah fungsi untuk mendapatkan nama-nama item product serta harganya
 * @param {page_number} -page number
 * @param {page_size} - untuk mengatur jumlah size halamannya
 * @param {sort} - untuk mengurutkan nama produk dan harganya nantinya
 * @param {search} - untuk mencari nama produk dan harga produknya
 * @returns
 */
async function getProducts({ page_number, page_size, sort, search }) {
  try {
    const products = await productsRepository.getProducts({
      page_number,
      page_size,
      sort,
      search,
    });
    return products;
  } catch (error) {
    throw new Error('Tidak bisa menghapus product');
  }
}
/**
 * sebuah fungsi untuk mendapatkan nama-nama item product serta harganya
 * @param {id} -id dari product yang kita punya
 * @returns
 */
async function getProduct(id) {
  try {
    const product = await productsRepository.getProduct(id);
    if (!product) return null;
    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  } catch (error) {
    throw new Error('Tidak bisa menghapus product');
  }
}
/**
 * sebuah fungsi untuk membuat atau memasukkan produk yang ingin kita masukkan ke dalam web
 * @param {name} -pnama dari produk yang akan kita masukkan
 * @param {price} - untuk memasukkan harga dari product yang kita masukkan
 * @returns
 */
async function createProduct(name, price) {
  try {
    const createdProduct = await productsRepository.createProduct(name, price);
    return createdProduct;
  } catch (error) {
    throw new Error('Tidak bisa menghapus product');
  }
}
/**
 * sebuah fungsi untuk memperbarui product yang kita punya
 * @param {id} -id dari produk yang kita punya
 * @param {name} - nama dari produk yang kita punya
 * @param {price} - harga dari produk yang kita punya
 * @returns
 */
async function updateProduct(id, name, price) {
  try {
    const product = await productsRepository.getProduct(id);
    if (!product) return null;
    await productsRepository.updateProduct(id, name, price);
    return true;
  } catch (error) {
    throw new Error('Tidak bisa menghapus product');
  }
}
/**
 * sebuah fungsi untuk menghapus product yang sudah ada
 * @param {id} -id dari product
 * @returns
 */
async function deleteProduct(id) {
  try {
    const product = await productsRepository.getProduct(id);
    if (!product) return null;
    await productsRepository.deleteProduct(id);
    return true;
  } catch (error) {
    throw new Error('Tidak Bisa menghapus product');
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
