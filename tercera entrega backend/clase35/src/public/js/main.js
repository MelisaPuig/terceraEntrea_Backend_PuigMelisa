const addToCartAPI = async (productId, count) => {
  const response = await fetch("/api/carritos/add", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ productId, count }),
  });
  const result = await response.json();
  return result;
};

const addToCart = async (productId, count) => {
  await addToCartAPI(productId, count);
  window.location.reload();
};

const removeFromCartAPI = async (productId, count) => {
  const response = await fetch("/api/carritos/remove", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ productId, count }),
  });
  const result = await response.json();
  return result;
};

const removeFromCart = async (productId, count) => {
  await removeFromCartAPI(productId, count);
  window.location.reload();
};

const buy = async () => {
  const response = await fetch("/api/carritos/buy", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: "{}",
  });
  const result = await response.json();
  if (result.result === true) {
    alert("Se ha realizado la compra con éxito");
  }
  return result;
};
