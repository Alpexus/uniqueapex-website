# Google Maps setup (~10 minutes)

The provider matches page (`/providers`) uses Google Maps to show the matched
clinics as clickable pins. It needs one API key. Until the key is added, the
page works fine — the map box just shows a note.

## 1 · Google Cloud account + project
1. Go to **https://console.cloud.google.com** and sign in with any Google account.
2. Top bar → project dropdown → **New project** → name it `UniqueApex` → Create.
3. Make sure the `UniqueApex` project is selected in the top bar.

## 2 · Billing (required by Google)
1. Left menu → **Billing** → link a billing account → add a credit card.
2. You will almost certainly pay **$0**: Google's free monthly tier currently
   covers roughly **10,000 map loads per month**, far above pilot traffic.
   (Optional peace of mind: Billing → Budgets & alerts → create a $5 budget
   so you get an email long before any real charge.)

## 3 · Enable the Maps JavaScript API
1. Left menu → **APIs & Services → Library**.
2. Search **"Maps JavaScript API"** → open it → **Enable**.
   (Only this one is needed — not Places, not Geocoding.)

## 4 · Create the key
1. **APIs & Services → Credentials → + Create credentials → API key.**
2. Copy the key that appears (starts with `AIza…`).

## 5 · Restrict the key (important — do not skip)
This key lives in the website code, so anyone can see it. Restrictions make it
useless anywhere except your site:
1. On the key → **Edit** →
2. **Application restrictions** → *Websites* → add:
   - `uniqueapex.com/*`
   - `www.uniqueapex.com/*`
   - `*.vercel.app/*`  (preview deploys)
   - `localhost:4321/*`  (local dev)
3. **API restrictions** → *Restrict key* → tick only **Maps JavaScript API**.
4. Save.

## 6 · Paste it into the site
1. Open `src/pages/providers.astro` in VS Code.
2. Near the top of the `<script>` section find:
   ```js
   const GMAPS_KEY = "PASTE_YOUR_GOOGLE_MAPS_KEY_HERE";
   ```
3. Replace the placeholder with your key (keep the quotes).
4. Push:
   ```
   git add .
   git commit -m "Add Google Maps key"
   git push origin main
   ```

## Checking usage later
Google Cloud console → **APIs & Services → Maps JavaScript API → Metrics**
shows exactly how many map loads you've used this month.
