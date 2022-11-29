export default function (context) {
  console.log(context.store);
  return context.redirect("/login");
}
