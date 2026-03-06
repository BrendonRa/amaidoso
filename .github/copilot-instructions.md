# Copilot Instructions for amaidoso

This repository is a very small proof‑of‑concept with two independent projects:
1. **backend** – a .NET 9 minimal Web API (generated from the `dotnet new webapi` template).
2. **frontend** – an Expo/React‑Native project (`App.tsx` + TypeScript) meant to run on a simulator or device.

Copilot (or any AI coding agent) should treat them as separate workspaces that communicate over HTTP.  There is no mono‑repo build system; the two sides are only loosely coupled.

## High‑level architecture

* `backend/backend/` contains the C# code.  `Program.cs` configures services, adds Swagger/OpenAPI, enables HTTPS redirection and maps controllers.
* Controllers live in `backend/backend/Controllers`.  The only existing controller is `WeatherForecastController` which returns a hard‑coded list of `WeatherForecast` objects defined in `backend/backend/WeatherForecast.cs`.
* There are no database layers, middleware, or other services yet – all data is in memory.
* The frontend is an Expo application in `frontend/`.  `App.tsx` is the entry point and currently displays a placeholder message.  The project uses plain React‑Native; no navigation or state libraries are configured.
* `backend/backend/http` is a HTTP‑client scratch file for manual testing (`backend/http` in the root contains the same file).  It defines a variable for `http://localhost:5141` and a single `GET /weatherforecast` request.

## Running the projects

### Backend

Use the .NET CLI or Visual Studio:

```powershell
cd backend\backend          # project folder
# first-time only
dotnet restore

# run in console (port is fixed in launchSettings)
dotnet run                 
```

The app listens on `https://localhost:7141` / `http://localhost:5141` by default (see `Properties/launchSettings.json`).  You can also run the entire `backend.sln` with Visual Studio or `dotnet watch run` for live reload.

Use the `backend.http` file in the root or the one under the project to exercise endpoints from VS Code's REST client.

### Frontend

```powershell
cd frontend
npm install                 # or yarn
npm run start               # equivalent to `expo start`
```

Open the Metro bundler in your browser and run on Android/iOS/ web or a simulator.  When the app needs to call the backend, point it at `http://<machine‑ip>:5141` (expos' emulator may not resolve `localhost`).

## Adding features / conventions

* **Backend controllers**: Add a new C# class under `Controllers` inheriting from `ControllerBase`.  Decorate with `[ApiController]` and `[Route("[controller]")]`.  Add action methods with `[HttpGet]`, `[HttpPost]`, etc.  Register services in `Program.cs` if you introduce custom classes.
* **Models**: Place simple DTO/model classes next to existing ones (e.g. in the project root) and reference them from controllers.  No `Domain` or `Data` folders yet.
* **Dependency injection**: Use `builder.Services.AddSingleton/Scoped/Transient` in `Program.cs`.  The template already adds logging.
* **Frontend code**: Use the standard Expo/React‑Native project structure.  Keep everything under `frontend/`; add new components as `.tsx` files and import them into `App.tsx`.  Use `expo install` when adding native packages so versions align with the Expo SDK.
* **Networking**: All HTTP calls from the frontend should target the backend's exposed port, usually `5141`; hard‑coding `localhost` will fail on device/simulator.  Consider using a configuration file or `process.env` to switch addresses.

## Developer workflow notes

* There are no unit tests or CI configured yet.  Tests should be added if the project grows.
* Build the backend with `dotnet build` and the front‑end with `npm run build` (Expo will generate web assets).  There is no integrated build step.
* Debugging: Attach a C# debugger in Visual Studio/VS Code to the backend.  For the front‑end use the Expo DevTools or React Native debugger.
* When adding NuGet or npm dependencies, keep versions compatible with .NET 9 and Expo SDK 55.

## External dependencies and integrations

* Currently there are no third‑party services (databases, cloud APIs, etc.).  Any new integrations should be registered in `Program.cs` or via Expo configuration.
* The only external packages are the default ones created by the templates.

## Noteworthy quirks / patterns

* The codebase is tiny and mostly template‑generated.  Don't expect complex domain logic or folder structure yet.
* The `.http` file is used for lightweight manual API testing.  Cards for new endpoints should be added there for convenience.
* Backend port numbers are defined in `launchSettings.json` – changing them requires updating `backend.http` and any frontend references.

---

If any part of this summary is unclear or if there are missing conventions you'd like the bot to know, please let me know so I can refine these instructions.