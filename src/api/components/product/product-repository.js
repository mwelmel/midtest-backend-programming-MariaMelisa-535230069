const { Product } = require('../../../models');

async function getProducts({ sort, search }) {
  try {
    let query = Product.find({});

    // Terapkan sort jika disediakan
    if (sort) {
      query = query.sort(sort);
    }

    // Terapkan pencarian jika disediakan
    if (search) {
      query = query.find({ $text: { $search: search } });
    }

    const products = await query.exec();

    return {
      count: products.length,
      data: products,
    };
  } catch (error) {
    throw new Error('error ketika menghitung produk yang kita punya');
  }
}

async function createProduct(name, price) {
  try {
    // Basic validation
    if (!name || !price || isNaN(parseFloat(price))) {
      throw new Error('produk data salah');
    }

    return await Product.create({
      name,
      price,
    });
  } catch (error) {
    throw new Error('Error ketika membuat produk');
  }
}

async function updateProduct(id, name, price) {
  try {
    // Basic validation
    if (!name || !price || isNaN(parseFloat(price))) {
      throw new Error('produk data salah');
    }

    return await Product.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          name,
          price,
        },
      }
    );
  } catch (error) {
    throw new Error('Error ketika memperbarui product');
  }
}

async function deleteProduct(id) {
  try {
    return await Product.deleteOne({ _id: id });
  } catch (error) {
    throw new Error('Error ketika menghapus produk');
  }
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
