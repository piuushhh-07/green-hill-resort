# Green Hill Resort Website

This is a separate Green Hill Resort version built from the supplied Chintamani Habitat website source. The original Chintamani Habitat project is not modified.

## Run locally
Open `index.html` in a browser, or run a local static server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to Netlify
1. Extract this ZIP.
2. In Netlify, choose **Add new site → Deploy manually** and drag the extracted project folder (or its contents) into the deploy area.
3. Netlify Forms is enabled on the booking enquiry form (`name=booking`, `data-netlify=true`). Check the first deployment's Forms tab and submit a test enquiry.

## Resort media
- The hero background uses `assets/media/pool-video-23.15.11.mp4` with autoplay, muted, loop and playsinline.
- The remaining supplied photographs are used in the website gallery and section imagery.
- Two other supplied videos are retained in `assets/media/` for future use.

## Before publishing
- Add the resort's confirmed phone / WhatsApp number and update the contact links.
- Confirm package rates, operating hours, guest capacity, outside-food policy, cancellation terms and exact booking conditions with resort management. These are intentionally not invented in this version.
- Check the map pin and booking form after deployment.
