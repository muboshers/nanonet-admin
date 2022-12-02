export default async function ({ store, route, redirect }) {
  const authenticated = await store.state.admin;
  if (!authenticated) {
    return redirect("/login");
  }
}
