<?php
require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../helpers/auth.php';

class CategoryController
{
    public function listCategories(): void {
        $categoryModel = new Category();
        $categories = $categoryModel->getAll();
        require __DIR__ . "/../../views/game/list_categories.php";
    }

    public function viewCategoryDetails(int $id): void {
        $categoryModel = new Category();
        $category = $categoryModel->findById($id);
        if ($category) {
            require __DIR__ . "/../../views/game/get_category_details.php";
        } else {
            http_response_code(404);
            echo "Category not found.";
        }
    }
}