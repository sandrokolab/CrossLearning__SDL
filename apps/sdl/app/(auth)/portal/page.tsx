import { createClient } from '@/lib/supabase/server'
import { PortalSelectionClient } from './portal-selection-client'

export default async function PortalPage() {
    const supabase = await createClient()

    // Fetch sites from Supabase
    const { data: sites } = await supabase
        .from('sites')
        .select('*')
        .order('name', { ascending: true })

    return (
        <main className="min-h-screen">
            <PortalSelectionClient sites={sites || []} />
        </main>
    )
}
