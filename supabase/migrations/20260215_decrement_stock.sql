-- Secure inventory decrement function
-- Prevents race conditions and ensures stock never goes negative
create or replace function decrement_stock(product_slug text, quantity_to_remove int)
returns void as $$
begin
  update products
  set stock = stock - quantity_to_remove
  where slug = product_slug and stock >= quantity_to_remove;
end;
$$ language plpgsql;
