// import './styles.scss'

import { MinusCircleIcon, PlusCircleIcon }            from '@heroicons/react/24/outline'
import { CheckCircleIcon }                            from '@heroicons/react/24/solid'
import { Button }                                     from '@nextui-org/button'
import { Spinner }                                    from '@nextui-org/react'
import BulletList                                     from '@tiptap/extension-bullet-list'
import { Color }                                      from '@tiptap/extension-color'
import ListItem                                       from '@tiptap/extension-list-item'
import OrderedList                                    from '@tiptap/extension-ordered-list'
import TextStyle                                      from '@tiptap/extension-text-style'
import { EditorContent, useCurrentEditor, useEditor } from '@tiptap/react'
import StarterKit                                     from '@tiptap/starter-kit'
import { useTheme }                                   from 'next-themes'
import  {  useEffect, useState }                      from 'react'


const MenuBar = () => {
  const { editor } = useCurrentEditor()
  const { theme } = useTheme()
  const [viewAll, setViewAll] = useState(false)

  if (!editor) {
    return null
  }

  const headingConfig = Array.from({ length: 6 }, (_, idx) => ({
    name:       `h${idx + 1}`,
    onClick:() => editor.chain().focus().toggleHeading({ level: idx + 1 }).run(),
    className: editor.isActive('heading', { level: idx + 1 }) ? 'bg-primary text-white ' : ''
  }))

  const configs = [
    {
      onClick: () => editor.chain().focus().toggleBold().run(),
      disabled: 
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
      ,
      name: 'bold'
    },
    {
      onClick: () => editor.chain().focus().toggleItalic().run(),
      disabled: 
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
      ,
      name: 'italic'
    },
    {
      onClick: () => editor.chain().focus().toggleStrike().run(),
      disabled: 
            !editor.can()
              .chain()
              .focus()
              .toggleStrike()
              .run()
      ,
      name: 'strike'
    },  
    ...headingConfig,
    {
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      name: 'Bullet List',
      label: 'bulletList'
    },
    {
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      name: 'Ordered List',
      label: 'orderedList'
    },
    {
      onClick:() => editor.chain().focus().undo().run(),
      disabled:
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run(),
      name: 'undo'
    },
    {
      onClick:() => editor.chain().focus().redo().run(),
      disabled:
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run(),
      name: 'redo'
    }
  ]

  return (
    <div className="control-group">
      <div className="flex flex-wrap gap-2 mb-3">
        {
          (viewAll ? configs : configs.splice(0,8)).map((item) => (
            <Button 
              key={item.name}
              size='sm'
              onClick={item.onClick}
              disabled={item?.disabled}
              className={
                `${item?.className || 
                  (editor.isActive(item?.label || item.name)
                    ? 'bg-primary text-white' 
                    : `bg-primary-200 ${theme === "light" ? "text-gray-700" : "text-white"}`)
                } capitalize`
              }
            >
              {item.name}
            </Button>
          ))
        }
        {
          viewAll
            ? <MinusCircleIcon cursor='pointer' width={22} onClick={() => setViewAll(false)} />
            : <PlusCircleIcon cursor='pointer' width={22} onClick={() => setViewAll(true)} />
        }
      </div>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  BulletList,
  OrderedList
]


export default function TextBox ({ content, setContent, isLoading, note }) {
  const defaultContent = `<p className="opacity-50">Anything else I want to remember?...</p>`
  
  const editor = useEditor({
    content: content || defaultContent,
    extensions: extensions,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (note?.content){
      editor?.commands.setContent(note.content)
    }
  }, [note, editor])


  return (
    <div className='my-6 rounded-lg relative'>
      <EditorContent 
        slotBefore={<MenuBar />}
        editor={editor} 
      />
      <div className='absolute right-2' style={{ bottom: '270px'}}>
        { 
          isLoading 
            ? <Spinner size='sm' />
            :<CheckCircleIcon className='text-success opacity-50' width={22} />
        }
      </div>
    </div>
  )
}
