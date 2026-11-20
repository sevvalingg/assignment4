-- Pandoc Lua filter: code blocks -> minted, inline code -> \texttt with break points.
local langs = { js = 'javascript', jsx = 'jsx', ts = 'typescript', tsx = 'tsx', sh = 'bash', md = 'markdown' }

function CodeBlock(el)
  local lang = langs[el.classes[1]] or el.classes[1] or 'text'
  return pandoc.RawBlock('latex', '\\begin{minted}{' .. lang .. '}\n' .. el.text .. '\n\\end{minted}')
end

local function escape(s)
  s = s:gsub('\\', '\0BS\0')
  s = s:gsub('([{}%$&#_%%])', '\\%1')
  s = s:gsub('~', '\\textasciitilde{}')
  s = s:gsub('%^', '\\textasciicircum{}')
  s = s:gsub('%z' .. 'BS' .. '%z', '\\textbackslash{}')
  -- allow line breaks after these characters in long inline code
  s = s:gsub('([%.,/%(%[:=|])', '%1\\allowbreak{}')
  return s
end

function Code(el)
  return pandoc.RawInline('latex', '\\texttt{' .. escape(el.text) .. '}')
end
