import React from 'react';
import InputComponent from "./InputFieldComponent.jsx";
import SearchButton from "../assets/svg files/SearchButton.jsx";
import ButtonComponent from "./ButtonComponent.jsx";

const SearchBarComponent = () => {
    return (
        <div className="search">
            <InputComponent
                placeholder="Search"
                variant="search"
            />

            <ButtonComponent
                variant="search"
                children={
                <SearchButton />
                }
            />
        </div>
    )
}

export default SearchBarComponent