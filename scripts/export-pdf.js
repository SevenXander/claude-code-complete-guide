/**
 * Claude Code 完全指南 - PDF 导出脚本
 *
 * 使用方法:
 * 1. 先启动 docsify 服务: docsify serve docs
 * 2. 安装依赖: npm install
 * 3. 运行: node scripts/export-pdf.js
 *
 * 感谢 @yuwen773 贡献此脚本 (PR #2)
 */

const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============ 配置 ============
const CONFIG = {
  baseUrl: 'http://localhost:3000',
  outputPath: './claude-code-complete-guide.pdf',
  tempDir: './temp-pdfs',
  waitTime: 2000,
  pageTimeout: 30000,
};

// ============ 解析侧边栏获取所有页面 ============
function parseSidebar() {
  const sidebarPath = path.join(__dirname, '..', 'docs', '_sidebar.md');
  const content = fs.readFileSync(sidebarPath, 'utf-8');
  const pages = [];

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const title = match[1];
    let url = match[2];

    if (url.startsWith('http') || url.startsWith('//') || url === '/') {
      continue;
    }

    url = url.replace(/\.md$/, '');
    const route = '#/' + url;

    pages.push({ title, route });
  }

  return pages;
}

// ============ 确保目录存在 ============
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ============ 下载单个页面 PDF ============
async function downloadPagePdf(page, browser, index, total) {
  const url = `${CONFIG.baseUrl}/${page.route}`;
  console.log(`[${index + 1}/${total}] 正在处理: ${page.title}`);

  try {
    const pageObj = await browser.newPage();

    await pageObj.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2,
    });

    await pageObj.goto(url, {
      waitUntil: 'networkidle0',
      timeout: CONFIG.pageTimeout,
    });

    await wait(CONFIG.waitTime);

    const pdfBytes = await pageObj.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `
        <div style="width:100%;text-align:center;font-size:10px;color:#999;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `,
    });

    await pageObj.close();

    return {
      title: page.title,
      pdfBytes: Buffer.from(pdfBytes),
    };
  } catch (error) {
    console.error(`  ❌ 错误: ${error.message}`);
    return null;
  }
}

// ============ 合并 PDF ============
async function mergePdfs(pdfBuffers) {
  console.log('\n正在合并 PDF...');

  const mergedPdf = await PDFDocument.create();

  for (const { title, pdfBytes } of pdfBuffers) {
    try {
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
      console.log(`  ✓ 添加: ${title}`);
    } catch (error) {
      console.error(`  ❌ 合并失败 ${title}: ${error.message}`);
    }
  }

  const finalBytes = await mergedPdf.save();
  fs.writeFileSync(CONFIG.outputPath, finalBytes);

  console.log(`\n✅ PDF 已导出: ${CONFIG.outputPath}`);
  console.log(`   文件大小: ${(finalBytes.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   总页数: ${mergedPdf.getPageCount()}`);
}

// ============ 主流程 ============
async function main() {
  console.log('='.repeat(50));
  console.log('Claude Code 完全指南 - PDF 导出工具');
  console.log('='.repeat(50));

  console.log('\n[1/4] 解析页面列表...');
  const pages = parseSidebar();
  console.log(`找到 ${pages.length} 个页面`);

  console.log('\n[2/4] 准备临时目录...');
  ensureDir(CONFIG.tempDir);
  fs.readdirSync(CONFIG.tempDir).forEach(file => {
    fs.unlinkSync(path.join(CONFIG.tempDir, file));
  });

  console.log('\n[3/4] 启动浏览器...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const pdfBuffers = [];

  for (let i = 0; i < pages.length; i++) {
    const result = await downloadPagePdf(pages[i], browser, i, pages.length);
    if (result) {
      pdfBuffers.push(result);
    }
  }

  await browser.close();

  console.log('\n[4/4] 生成最终 PDF...');
  await mergePdfs(pdfBuffers);

  fs.rmSync(CONFIG.tempDir, { recursive: true, force: true });

  console.log('\n完成!');
}

main().catch(error => {
  console.error('导出失败:', error);
  process.exit(1);
});
