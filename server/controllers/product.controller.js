import ProductModel from "../models/product.model.js";

export const createProductController = async (request, response) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = request.body;

    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !price ||
      !description
    ) {
      return response.status(400).json({
        message: "Enter required field",
        error: true,
        succes: false,
      });
    }

    const product = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });

    const saveProduct = await product.save();

    return response.json({
      message: "Product Created Successfully",
      data: saveProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      succes: false,
    });
  }
};

export const getProductController = async (request, response) => {
  try {
    let { page, limit, search } = request.body;

    if (!page) {
      page = 2;
    }
    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);
    return response.json({
      message: "Product data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      succes: false,
    });
  }
};

export const getProductByCategory = async (request, response) => {
  try {
    const { id } = request.body;

    if (!id) {
      return response.status(400).json({
        message: "provide category id",
        error: true,
        success: false,
      });
    }

    const product = await ProductModel.find({
      category: { $in: id },
    }).limit(15);

    return response.json({
      message: "category product list",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategoryAndSubCategory = async (request, response) => {
  try {
    const { categoryId, subCategoryId, page, limit } = request.body;

    if (!categoryId || !subCategoryId) {
      return response.status(400).json({
        message: "Provide categoryId and subCategoryId",
        error: true,
        success: false,
      });
    }

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const query = {
      category: { $in: categoryId },
      subCategory: { $in: subCategoryId },
    };

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query).sort({ createAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "product list",
      data: data,
      totalCount: dataCount,
      page: page,
      limit: limit,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//get all product details
export const getProductDetails = async (request, response) => {
  try {
    const { productId } = request.body;

    if (!productId) {
      return response.status(400).json({
        message: "Product ID is required",
        error: true,
        success: false,
      });
    }

    const product = await ProductModel.findOne({ _id: productId });

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Product details",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//update product
export const updateProductController = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Provide product _id",
        error: true,
        success: false,
      });
    }

    const updateProduct = await ProductModel.updateOne(
      { _id: _id },
      {
        ...request.body,
      }
    );

    return response.json({
      message: "Update Successfully",
      data: updateProduct,
      error: false,
      success: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//delete product

export const deleteProductDetails = async (request, response) => {
  try {
    const {_id}=request.body;

    if(!_id){
      return response.status(400).json({
        message: "provide _id",
        error: true,
        success:false
      })
    }

    const deleteProduct=await ProductModel.deleteOne({_id:_id})

    return response.json({
      message: "Delete Successfull",
      error: false,
      success: true,
      data:deleteProduct
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
};

//search product

export const searchProduct = async (request, response) => {
  try {
    
    let {search,page,limit}=request.body

    if(!page){
      page=1
    }
    if(!limit){
      limit=10
    }

    const query=search ? {
      $text: {
        $search:search
      }

    }:{

    }
    const skip=(page -1)*limit

    

    const [data,dataCount]=await Promise.all([
      ProductModel.find(query).sort({createAt : -1}).skip(skip).limit(limit).populate('category subCategory'),
      ProductModel.countDocuments(query)
    ])


    return response.json({
      message: "product data",
      error: false,
      success: true,
      data:data,
      totalCount:dataCount,
      totalPage:Math.ceil(dataCount/limit),
      page:page,
      limit: limit
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
};
