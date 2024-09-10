// controller/Categories.js

// import the places file from models
const Category = require('../models/categories');

// Add New Category
const AddCategory  = async (req, res, next) => {
    const newCategory = new Category({ ...req.body, holiday: []});

    try {
        await newCategory.save();
        return res.status(201).json({ message: 'Category Successfully Created.', category: newCategory });
    } catch (error) {
        return res.status(500).json({ message: 'Creating category failed, please try again.', error: error.message });
    }


};

// View All Categories
const ViewCategories = async (req, res, next) => {

    try {
        const categories = await Category.find({});
        return res.json(categories);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// View Category By ID
const ViewCategoryById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const category = await Category.findById(id);
        if(!category){
            return res.json({ message: 'Category Not found!' });
        }

        return res.json(category);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


// Update Category
const UpdateCategory = async (req, res, next) => {
    const id = req.params.id;

    let category;
    try {
        category = await Category.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });

        return res.json({ message: 'Category Updated', category });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong, could not update Category.', error: error.message });
    }
};

// Delete Category
const DeleteCategory = async (req, res, next) => {
    const id = req.params.id;

    try {
        await Category.findByIdAndDelete(id);
        return res.json({ message: 'Category Deleted' });

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = { AddCategory, ViewCategories, ViewCategoryById, UpdateCategory, DeleteCategory };