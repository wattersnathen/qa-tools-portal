async function fetchProducts() {
    const response = await fetch('/api/products');
    const body = await response.json();
    return body;
}

function renderProduct(product) {
    const wrapper = document.getElementById('product-catalog');
    const div = document.createElement('div');
    div.className = 'product-item'
    div.innerHTML = `
        <div data-testId="product-name">${product.name}</div>
        <div data-testId="product-price">${product.price}</div>
    `;
    wrapper.appendChild(div);
}

async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const formJSON = Object.fromEntries(data.entries());
    const response = await fetch('/api/checkout', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formJSON)
    });

    const div = document.createElement('div');
    div.className = 'response';
    div.innerHTML = JSON.stringify(await response.json(), null, 4);
    document.getElementById('wrapper').appendChild(div);
    setTimeout(() => div.remove(), 9000);
}

document.addEventListener('DOMContentLoaded', (event) => {
    fetchProducts().then(products => products.forEach(renderProduct));
    const form = document.querySelector('form');
    form.addEventListener('submit', handleSubmit);
});