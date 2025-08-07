const fs = require('fs');
const path = require('path');

// 需要修复的文件列表
const filesToFix = [
  'components/ui/scroll-area.tsx',
  'components/ui/dialog.tsx', 
  'components/ui/slider.tsx',
  'components/ui/tabs.tsx',
  'components/ui/alert-dialog.tsx',
  'components/ui/aspect-ratio.tsx',
  'components/ui/form.tsx',
  'components/ui/switch.tsx',
  'components/ui/separator.tsx',
  'components/ui/context-menu.tsx',
  'components/ui/dropdown-menu.tsx',
  'components/ui/collapsible.tsx',
  'components/ui/tooltip.tsx',
  'components/ui/sheet.tsx',
  'components/ui/checkbox.tsx',
  'components/ui/hover-card.tsx',
  'components/ui/sidebar.tsx',
  'components/ui/toggle.tsx',
  'components/ui/popover.tsx',
  'components/ui/badge.tsx',
  'components/ui/select.tsx',
  'components/ui/accordion.tsx',
  'components/ui/navigation-menu.tsx',
  'components/ui/progress.tsx',
  'components/ui/breadcrumb.tsx',
  'components/ui/menubar.tsx',
  'components/ui/label.tsx',
  'components/ui/avatar.tsx',
  'components/ui/toggle-group.tsx',
  'components/ui/radio-group.tsx'
];

filesToFix.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // 修复 @radix-ui 包的版本号
      content = content.replace(/@radix-ui\/([^@]+)@[0-9.]+/g, '@radix-ui/$1');
      
      // 修复 lucide-react 的版本号
      content = content.replace(/lucide-react@[0-9.]+/g, 'lucide-react');
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
});

console.log('Import fixes completed!');