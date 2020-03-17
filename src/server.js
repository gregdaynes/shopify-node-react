require("isomorphic-fetch");

const dotenv = require("dotenv");
const Koa = require("koa");
const next = require("next");
const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");

dotenv.config();
const { default: graphQLProxy } = require("@shopify/koa-shopify-graphql-proxy");
const { ApiVersion } = require("@shopify/koa-shopify-graphql-proxy");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

app.prepare().then(() => {
  const server = new Koa();
  server.use(session({ secure: true, sameSite: "none" }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: [
        "read_content",
        "write_content",
        "read_themes",
        "write_themes",
        "read_products",
        "write_products",
        "read_product_listings",
        "read_customers",
        "write_customers",
        "read_orders",
        "write_orders",
        "read_draft_orders",
        "write_draft_orders",
        "read_inventory",
        "write_inventory",
        "read_locations",
        "read_script_tags",
        "write_script_tags",
        "read_fulfillments",
        "write_fulfillments",
        "read_assigned_fulfillment_orders",
        "write_assigned_fulfillment_orders",
        "read_merchant_managed_fulfillment_orders",
        "write_merchant_managed_fulfillment_orders",
        "read_third_party_fulfillment_orders",
        "write_third_party_fulfillment_orders",
        "read_shipping",
        "write_shipping",
        "read_analytics",
        "read_checkouts",
        "write_checkouts",
        "read_reports",
        "write_reports",
        "read_price_rules",
        "write_price_rules",
        "read_discounts",
        "write_discounts",
        "read_marketing_events",
        "write_marketing_events",
        "read_resource_feedbacks",
        "write_resource_feedbacks",
        "read_shopify_payments_payouts",
        "read_shopify_payments_disputes",
        "read_translations",
        "write_translations",
        "read_locales",
        "write_locales"
      ],
      afterAuth(ctx) {
        const { shop } = ctx.session;

        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });

        ctx.redirect("/");
      },
    })
  );

  server.use(graphQLProxy({ version: ApiVersion.October19 }));
  server.use(verifyRequest());
  server.use(async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return;
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
