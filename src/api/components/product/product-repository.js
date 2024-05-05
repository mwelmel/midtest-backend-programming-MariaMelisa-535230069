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
    throw new Error('Error while fetching products');
  }
}

async function createProduct(name, price) {
  try {
    // Basic validation
    if (!name || !price || isNaN(parseFloat(price))) {
      throw new Error('Invalid product data');
    }

    return await Product.create({
      name,
      price,
    });
  } catch (error) {
    throw new Error('Error while creating product');
  }
}

async function updateProduct(id, name, price) {
  try {
    // Basic validation
    if (!name || !price || isNaN(parseFloat(price))) {
      throw new Error('Invalid product data');
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
    throw new Error('Error while updating product');
  }
}

async function deleteProduct(id) {
  try {
    return await Product.deleteOne({ _id: id });
  } catch (error) {
    throw new Error('Error while deleting product');
  }
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
