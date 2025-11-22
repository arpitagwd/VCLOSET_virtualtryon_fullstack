// import { useContext } from "react";
// import { WishlistContext } from "../context/WishlistContext";
// import { Link } from "react-router-dom";

// const Wishlist = () => {
//     const { wishlist, removeFromWishlist } = useContext(WishlistContext);

//     return (
//         <div>
//             <h2>My Wishlist</h2>
//             {wishlist.length === 0 ? <p>No items in wishlist.</p> : (
//                 wishlist.map(product => (
//                     <div key={product._id}>
//                         <h3>{product.name}</h3>
//                         <p>{product.description}</p>
//                         <button onClick={() => removeFromWishlist(product._id)}>Remove</button>
//                         <Link to={`/product/${product._id}`}>View Product</Link>
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// };

// export default Wishlist;
