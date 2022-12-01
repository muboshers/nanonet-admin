export default function (context) {
  if (!context.store.admin) return context.redirect("/login");
}
