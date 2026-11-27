import ResourceManager from '@/components/admin/ResourceManager';
export default function Page() {
  return <ResourceManager table="faqs" title="FAQs" orderBy="sort" addLabel="Add FAQ"
    defaults={{ active: true, sort: 0, q_hi: '', a_hi: '' }}
    columns={['q_en', 'sort', 'active']}
    fields={[
      { key: 'q_en', label: 'Question (English)', type: 'text' }, { key: 'q_hi', label: 'Question (Hindi)', type: 'text' },
      { key: 'a_en', label: 'Answer (English)', type: 'textarea' }, { key: 'a_hi', label: 'Answer (Hindi)', type: 'textarea' },
      { key: 'sort', label: 'Order', type: 'number' }, { key: 'active', label: 'Active', type: 'bool' },
    ]} />;
}
