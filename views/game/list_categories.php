<label for="category">Choose Categories:</label>
<select name="category" id="category">
    <option value="">-- Select a category --</option>
    <?php foreach ($categories as $category): ?>
        <option          
            value="<?php echo htmlspecialchars($category['id']); ?>"
            data-description="<?php echo htmlspecialchars($category['description']); ?>">
            <?php echo htmlspecialchars($category['name']); ?>
        </option>
    <?php endforeach; ?>
</select>

<div id="category-description" style="margin-top:10px; font-style:italic; color:#555;"></div>

<h2>Picked Categories</h2>
<ul id="picked-categories"></ul>

<!-- Hidden input to store picked category IDs -->
<input type="hidden" name="picked_categories" id="picked_categories">

<script>
document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('category');
    const descriptionBox = document.getElementById('category-description');
    const pickedList = document.getElementById('picked-categories');
    const hiddenInput = document.getElementById('picked_categories');

    let pickedIds = [];

    function updateHiddenInput() {
        hiddenInput.value = pickedIds.join(',');
    }

    select.addEventListener('change', function () {
        const option = select.options[select.selectedIndex];
        descriptionBox.textContent = option.dataset.description || '';

        if (option.value) {
            const categoryId = option.value;
            const categoryName = option.text;
            const categoryDescription = option.dataset.description;

            // Add to pickedIds
            pickedIds.push(categoryId);
            updateHiddenInput();

            // Create picked category entry
            const li = document.createElement('li');
            li.textContent = categoryName + " — " + categoryDescription;
            li.dataset.id = categoryId;

            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.type = "button";
            removeBtn.textContent = "Remove";
            removeBtn.style.marginLeft = "10px";
            removeBtn.addEventListener('click', function () {
                const opt = document.createElement('option');
                opt.value = categoryId;
                opt.text = categoryName;
                opt.dataset.description = categoryDescription;
                select.add(opt);

                pickedList.removeChild(li);
                pickedIds = pickedIds.filter(id => id !== categoryId);
                updateHiddenInput();
            });

            li.appendChild(removeBtn);
            pickedList.appendChild(li);

            // Remove option from dropdown
            select.remove(select.selectedIndex);

            descriptionBox.textContent = "";
            select.selectedIndex = 0;
        }
    });

    // Show description on hover
    select.addEventListener('mouseover', function () {
        const option = select.options[select.selectedIndex];
        descriptionBox.textContent = option.dataset.description || '';
    });

    // Initialize description
    if (select.options.length > 0) {
        descriptionBox.textContent = select.options[0].dataset.description || '';
    }
});
</script>
