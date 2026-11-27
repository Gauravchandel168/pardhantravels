import ResourceManager from '@/components/admin/ResourceManager';
export default function Page() {
  return <ResourceManager table="routes" title="Routes" orderBy="sort" slugFrom="to_en" addLabel="Add route"
    hint="Each route gets its own page on the website (Ambala to …). Fares are worked out from distance × car rate."
    defaults={{ active: true, sort: 0, distance_km: 0, duration_text: '', intro_en: '', intro_hi: '', to_hi: '', image_url: '' }}
    columns={['to_en', 'distance_km', 'duration_text', 'active']}
    fields={[
      { key: 'to_en', label: 'Destination (English)', type: 'text' }, { key: 'to_hi', label: 'Destination (Hindi)', type: 'text' },
      { key: 'distance_km', label: 'Distance (km)', type: 'number' }, { key: 'duration_text', label: 'Travel time (e.g. 4 hrs)', type: 'text' },
      { key: 'intro_en', label: 'Description (English)', type: 'textarea' }, { key: 'intro_hi', label: 'Description (Hindi)', type: 'textarea' },
      { key: 'image_url', label: 'Photo', type: 'image' }, { key: 'sort', label: 'Order', type: 'number' },
      { key: 'active', label: 'Active (show on website)', type: 'bool' },
    ]} />;
}
