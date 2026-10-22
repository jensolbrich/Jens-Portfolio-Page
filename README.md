# Jens Olbrich – Portfolio

Statische Website aus HTML, CSS und JavaScript. GitHub Pages: Settings → Pages → Deploy from a branch → main → /(root) → Save.

Die index.html liegt direkt im Repository-Hauptverzeichnis. Kein Build-Schritt erforderlich. .nojekyll deaktiviert die Jekyll-Verarbeitung.

Kontaktformular: Übergabe an den konfigurierten n8n-Webhook. Nach Veröffentlichung in n8n die neue Website-Origin als Allowed Origin konfigurieren und einen Test durchführen.
Newsletter: direkter Supabase-Zugriff per Publishable Key und RLS. Dieser Key ist absichtlich öffentlich; keine Secret-/Service-Role-Schlüssel veröffentlichen. Kein Newsletter-Versand implementiert.

Datenschutzerklärung ist noch ein Entwurf. GitHub Pages, n8n und Supabase müssen vor öffentlicher Nutzung vollständig berücksichtigt werden.

Dieses Paket ist ein Veröffentlichungsstand. Weiterbearbeitet wird der bestätigte dist-Ordner auf dem Desktop. Für spätere Veröffentlichungen die aktualisierten Website-Dateien übernehmen; keine .env oder Referenzunterlagen kopieren.
