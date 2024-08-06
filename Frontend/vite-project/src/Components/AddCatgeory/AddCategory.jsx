import React, { useState } from 'react';
import useStore from '../Store/Store';

const AddCategory = () => {
    const [category, setCategory] = useState('');
    const addCategory = useStore((store)=>store.addCategory)

    const handleSubmit =async (e) => {
        e.preventDefault();
    const data ={
        CName : category
    }
       const result = await addCategory(data)

       if(result){
        console.log(result)
        setCategory('');
       }
    };

    return (
        <div className="add-products-container">
            <h2 className="add-products-heading">Add Category</h2>
            <form className="add-products-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="category" className="form-label">Category</label>
                    <input
                        id="category"
                        type="text"
                        className="form-input"
                        required
                        placeholder="Enter category name"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <button type="submit" className="add-products-button">Add Category</button>
            </form>
        </div>
    );
};

export default AddCategory;
