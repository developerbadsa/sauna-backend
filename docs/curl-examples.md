# Curl Examples

## Register
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'
```

## Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'
```

## List Products
```bash
curl "http://localhost:4000/api/products?page=1&limit=10"
```

## Add to Cart
```bash
curl -X POST http://localhost:4000/api/cart \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"productId":"<productId>","quantity":1}'
```

## Create Order
```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","address1":"123 Main St","city":"Toronto","postalCode":"M5V 2T6","country":"Canada"}'
```
