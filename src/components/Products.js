import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import { debounce } from "@mui/material";
import { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setLoading] = useState(true);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  //CART:
  const [cartData, setCartData] = useState([]);

  // const dummyData = {
  //   name: "Tan Leatherette Weekender Duffle",
  //   category: "Fashion",
  //   cost: 150,
  //   rating: 4,
  //   image:
  //     "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  //   _id: "PmInA797xJhMIPti",
  // };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setLoading(true);

    try {
      
      let res = await axios.get(`${config.endpoint}/products`);
      setLoading(false);
      setData(res.data);
      // console.log(res.data,"This is the data");
      setFilteredData(res.data);
    } catch (e) {
      setLoading(false);
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar("Something Went Wrong", { variant: "error" });
      }
    }
  };
  // performAPICall Function:

  // This function is defined as an asynchronous function.
  // It sets the isLoading state to true to indicate that data is being fetched.
  // Then it makes a GET request to the /products endpoint using Axios.
  // Upon receiving a response, it sets the isLoading state to false.(fetching done)
  // If the request is successful (res), it sets the data and filteredData states with the response data.
  // If an error occurs during the API call (caught by the catch block), it sets the isLoading state to false and displays an error message using the enqueueSnackbar function from notistack.


  useEffect(() => {
    performAPICall();
    // setDataLoaded("loaded");
    //fetchCart()
  }, []);

  // the array is empty, like in this case [], it means that the effect should only run once after the component mounts, and it won't re-run again unless the component is unmounted and then mounted again



  
  useEffect(() => {
    if(localStorage.getItem("token")){
    fetchCart(localStorage.getItem("token"))  //productId, qty
      .then((cartItems) => {
        return generateCartItemsFrom(cartItems, data);   //id, qty, cost, name, image
      })
      .then((res) => {
        console.log(res);
        setCartData(res);
      });
    }
  }, [data]);
  //data: list of all products (perform API Call)

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const res = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setFilteredData(res.data);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          setFilteredData([]);
        } else if (e.response.status === 500) {
          setFilteredData(data);
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        }
      }
    }
    // setLoading(true);
    // try {
    //   const res = await axios.get(
    //     `${config.endpoint}/products/search?value=${text}`
    //   );
    //   setLoading(false);
    //   console.log(res.data);
    //   setData(res.data);

    // } catch (e) {
    //   setLoading(false);
    //   setData([]);
    //   if (e.response) {
    //     enqueueSnackbar(e.response.data.message, { variant: "error" });
    //     return null;
    //   } else {
    //     enqueueSnackbar("Something Went Wrong", { variant: "error" });
    //   }

    // }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    // If there is an existing debounceTimeout, clear it
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
     // Set a new timeout to execute performSearch after 500 milliseconds
    const timeout = setTimeout(async () => {
      await performSearch(value);
    }, 500);
    // Store the new timeout in state for future reference
    setDebounceTimeout(timeout);
  };

  const handleSearch = (e) => {
    performSearch(e.target.value);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res.data,"This is fetchkard data");
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let p = false;
    items.forEach((ele) => {
      if (ele.productId === productId) p = true;
    });

    return p;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,   //merged cart data
    products,   //list of all products
    productId,  //item on which we clicked add to cart
    qty,    //item qty
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    } else {
      if (options.preventDuplicate && isItemInCart(items, productId)) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "warning" }
        );
      } else {
        
        const res = await axios.post(`${config.endpoint}/cart`, {productId, qty}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);  //updated cart data(unmerged)
        const result = generateCartItemsFrom(res.data, products);
        setCartData(result);
      }
    }
  };

  const handleQuantity = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    } else {
        const res = await axios.post(`${config.endpoint}/cart`, {productId, qty}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = generateCartItemsFrom(res.data, data);
        setCartData(result);
     
    }
  };
  // const handleSearch = (e) => {
  //   let str = e.target.value
  //   console.log(str);
  //   performSearch(str)
  // }


  let handleCartButton = (e)=>{
      console.log(e.target.id);
      const [obj] = filteredData.filter((ele)=>{
        return e.target.id === ele._id;
      });

      addToCart(localStorage.getItem("token"), cartData, data, e.target.id, 1,{preventDuplicate:true})
  }
  return (
    <div>
      <Header>

        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => {
            debounceSearch(e, debounceTimeout);
            // handleSearch(e) to check if we do not use debounce ,it would work?(funtion is at line 404)
          }}
        />
        
      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => {
          debounceSearch(e, debounceTimeout);
        }}
      />
      <Grid container>
        <Grid
          item
          className="product-grid"
          md={localStorage.getItem("token") ? 9 : 12}
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          {isLoading ? (
            <Box className="loading">
              <CircularProgress />
              <div>Loading Products...</div>
            </Box>
          ) : (
            <div className="product-container">
              <Grid container spacing={3}>
                {filteredData.length ? (
                  filteredData.map((ele) => (
                    <Grid item xs={6} md={3} key={ele._id}>
                      <ProductCard
                        product={ele}
                        handleAddToCart={(e) => handleCartButton(e)}
                      />
                    </Grid>
                  ))
                ) : (
                  <Box className="loading">
                    <SentimentDissatisfied />
                    <div>No products found</div>
                  </Box>
                )}
              </Grid>
            </div>
          )}
        </Grid>
        {localStorage.getItem("token") ? (
          <Grid item xs={12} md={3} className="cart-container">
            <Cart items={cartData} products={data} handleQuantity={addToCart}/>
          </Grid>
        ) : null}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
