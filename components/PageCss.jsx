import css from '@/lib/css';

export default function PageCss({ page }) {
  return <style dangerouslySetInnerHTML={{ __html: css[page] || '' }} />;
}
