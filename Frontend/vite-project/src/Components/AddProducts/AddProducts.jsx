import React, { useEffect, useState } from 'react';
import useStore from '../Store/Store';

const AddProducts = () => {
    const [pName, setPName] = useState('');
    const [pDescription, setPDescription] = useState('');
    const [price, setPrice] = useState('');
    const [pImage, setPImage] = useState(null);
    const [data, setData] = useState([]);
    const [category, setCategory] = useState('');
    
    const getCategory = useStore((store) => store.getCategory);
    const addProduct = useStore((store) => store.addProduct);
    // const token = Cookies.get('Token');

    useEffect(() => {
        const fetchData = async () => {
            const result = await getCategory();
            if (result) {
                setData(result);
                console.log(result)
            }
        };
        fetchData();
    }, [getCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();   

        const formData = new FormData();
        formData.append('Pname', pName);
        formData.append('Pdescription', pDescription);
        formData.append('Price', price);
        formData.append('Cid', category);
        if (pImage) {
            formData.append('formFile', pImage);
        }

        try {
            const result = await addProduct(formData);
            if (result) {
                console.log(result);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="add-products-container">
            <h2 className="add-products-heading">Add Product</h2>
            <form className="add-products-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="pName" className="form-label">Product Name</label>
                    <input
                        id="pName"
                        type="text"
                        className="form-input"
                        required
                        placeholder="Enter product name"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pDescription" className="form-label">Product Description</label>
                    <textarea
                        id="pDescription"
                        className="form-input"
                        required
                        placeholder="Enter product description"
                        value={pDescription}
                        onChange={(e) => setPDescription(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        id="price"
                        type="number"
                        className="form-input"
                        required
                        placeholder="Enter product price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pImage" className="form-label">Product Image</label>
                    <input
                        id="pImage"
                        type="file"
                        className="form-input"
                        onChange={(e) => setPImage(e.target.files[0])}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        id="category"
                        className="form-input"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select a category</option>
                        {data.map((e) => (
                            <option key={e.cid} value={e.cid}> 
                                {e.cname} 
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="add-products-button">Add Product</button>
            </form>
        </div>
    );
};

export default AddProducts;
