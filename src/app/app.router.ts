import Router from "virtual:rasengan/router";
import { defineRouter, RouterComponent } from "rasengan";
import NindoNotFound from "./_routes/notfound";

class AppRouter extends RouterComponent {}

export default defineRouter({
    imports: [Router],
    notFoundComponent: NindoNotFound
})(AppRouter);
