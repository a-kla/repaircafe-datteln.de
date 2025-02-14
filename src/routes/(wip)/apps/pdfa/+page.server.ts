import type { PageServerLoad } from './$types';
import { getPdfPath, availablePdfs } from "../../../(server)/assets/RC_Datteln-[name]_[date].pdf/configPdf"
import { dev } from '$app/environment';

export const load = (async () => {
    const entries = await Promise.all(
        dev ? availablePdfs.map(
            async (name) => (
                {
                    name: name,
                    path: await getPdfPath(name)
                }
            )
        ) : availablePdfs.filter(
            (name) => !name.startsWith('_')
        ).map(
            async (name) => (
                {
                    name: name,
                    path: await getPdfPath(name)
                }
            )
        )
    )

    return {
        allPDFs: entries
    }
}) satisfies PageServerLoad

// export const csr = false // prevent rerendering to blank page

