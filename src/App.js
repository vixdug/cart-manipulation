import React, { useState } from "react";
import axios from "axios";

// variantToUse: gid://shopify/ProductVariant/31367764738070

const ShopifyCart = () => {
  const [cartData, setCartData] = useState(null);
  const [cartId, setCartId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleCartQuery = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://plant-dyed-goods.myshopify.com/api/2023-01/graphql.json",
        {
          query: `
            query {
              cart(
                id: "${cartId}"
              ) {
                id
                createdAt
                updatedAt
                checkoutUrl
                lines(first: 10) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                        }
                      }
                      attributes {
                        key
                        value
                      }
                    }
                  }
                }
                attributes {
                  key
                  value
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalTaxAmount {
                    amount
                    currencyCode
                  }
                  totalDutyAmount {
                    amount
                    currencyCode
                  }
                }
                buyerIdentity {
                  email
                  phone
                  customer {
                    id
                  }
                  countryCode
                  deliveryAddressPreferences {
                    ... on MailingAddress {
                      address1
                      address2
                      city
                      provinceCode
                      countryCodeV2
                      zip
                    }
                  }
                }
              }
            }
          `
        },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token":
              "6f3f08ba8148dd3d7d4ffcad45a4b1bb"
          }
        }
      );
      setCartData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCartUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://plant-dyed-goods.myshopify.com/api/2023-01/graphql.json",
        {
          query: `
          mutation {
            cartLinesAdd(cartId: "${cartId}"
            lines: [
            {
            quantity: ${quantity}
            merchandiseId: "${variantId}"
            }
            ]
            ) { 
              cart {
                id
                lines(first: 10){
                  edges
                  {
                    node{
                      quantity
                      merchandise{
                        ... on ProductVariant {
                          id
                        }
                      }
                    }
                  }
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalTaxAmount {
                    amount
                    currencyCode
                  }
                  totalDutyAmount {
                    amount
                    currencyCode
                  }
                }
              }
              
              
              userErrors {
                field
                message
              }
            }
          }
          
          `
        },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token":
              "6f3f08ba8148dd3d7d4ffcad45a4b1bb"
          }
        }
      );
      console.log(variantId);
      console.log(quantity);
      console.log(cartId);
      console.log(response);
      console.log(response.data.data.cartLineUpdate);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleCartQuery}>
        <label htmlFor="cartId">Cart ID:</label>
        <input
          type="text"
          id="cartId"
          value={cartId}
          onChange={(event) => setCartId(event.target.value)}
        />
        <button type="submit">Query Cart</button>
      </form>
      <form onSubmit={handleCartUpdate}>
        <label htmlFor="variantId">Variant ID:</label>
        <input
          type="text"
          id="variantId"
          value={variantId}
          onChange={(event) => setVariantId(event.target.value)}
        />
        <button type="submit">Update Lines</button>

        <label htmlFor="quantity">Quantity:</label>
        <input
          type="text"
          id="quantity"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </form>
      {cartData && (
        <div>
          <h2>Cart Data:</h2>
          <pre>{JSON.stringify(cartData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
export default ShopifyCart;
