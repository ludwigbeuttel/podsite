<template>
  <v-input
    class="fullEditor v-input v-textarea v-text-field v-text-field--filled v-text-field--is-booted v-text-field--enclosed v-input--is-focused pt-2"
    :class="[$vuetify.theme.dark ? 'theme--dark' : 'theme--light', focus ? 'v-input--focused' : '']"
    v-bind="$attrs"
    height="300"
  >
    <label
      v-show="label"
      class="v-label"
      :class="$vuetify.theme.dark ? 'theme--dark' : 'theme--light'"
      style="z-index:2"
    >{{ label }}</label>
    <div style="display: flex; flex-direction: column; height: 100%; width: 100%;">
      <editor-menu-bar :editor="editor" @click="toggleFormat()">
        <v-row slot-scope="{ commands, isActive }" class="shrink" no-gutters style="z-index:1">
          <v-btn-toggle multiple class="mr-2" active-class="none">
            <v-btn
              text
              active-class="none"
              :class="{ 'v-btn--active': isActive.bold() }"
              @click="commands.bold"
            >
              <v-icon>mdi-format-bold</v-icon>
            </v-btn>

            <v-btn
              text
              active-class="none"
              :class="{ 'v-btn--active': isActive.italic() }"
              @click="commands.italic"
            >
              <v-icon>mdi-format-italic</v-icon>
            </v-btn>

            <v-btn
              text
              active-class="none"
              :class="{ 'v-btn--active': isActive.underline() }"
              @click="commands.underline"
            >
              <v-icon>mdi-format-underline</v-icon>
            </v-btn>

            <v-btn
              text
              active-class="none"
              :class="{ 'v-btn--active': isActive.strike() }"
              @click="commands.strike"
            >
              <v-icon>mdi-format-strikethrough</v-icon>
            </v-btn>
          </v-btn-toggle>

          <v-btn-toggle class="mr-2" active-class="none">
            <v-btn
              text
              active-class="none"
              :class="{ 'v-btn--active': isActive.bullet_list() }"
              @click="commands.bullet_list"
            >
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-btn>

            <v-btn
              text
              active-class="none"
              :class="{ 'v-btn--active': isActive.ordered_list() }"
              @click="commands.ordered_list"
            >
              <v-icon>mdi-format-list-numbered</v-icon>
            </v-btn>
          </v-btn-toggle>

          <v-spacer />

          <v-btn-toggle multiple active-class="none">
            <v-btn
              text
              active-class="none"
              :class="{ 'v-btn--active': isActive.link() }"
              @click="isActive.link() ? commands.link() : linkDialog = true"
            >
              <v-icon>
                <template v-if="isActive.link()">mdi-link-off</template>
                <template v-else>mdi-link</template>
              </v-icon>
            </v-btn>

            <altDialog v-model="linkDialog" max-width="400" no-fullscreen>
              <v-card>
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-text-field v-model="hyperlink" hide-details outlined label="URL" />
                  </v-list-item-content>
                </v-list-item>
                <v-card-actions>
                  <v-spacer />
                  <v-btn text color="secondary" @click="linkDialog=false">abbrechen</v-btn>
                  <v-btn
                    outlined
                    color="secondary"
                    @click="[commands.link({href: hyperlink}),linkDialog=false,hyperlink='']"
                  >OK</v-btn>
                </v-card-actions>
              </v-card>
            </altDialog>

            <v-btn text active-class="none" @click="$refs.upload.click()">
              <v-icon>mdi-image</v-icon>
            </v-btn>
            <input
              ref="upload"
              type="file"
              style="display:none"
              @change="showImagePrompt($event, commands.image)"
            />
          </v-btn-toggle>
        </v-row>
      </editor-menu-bar>

      <v-divider style="margin-top: -1px; z-index:0" />

      <editor-content class="editor__content flex" :editor="editor" />
    </div>
  </v-input>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator"
// @ts-ignore
import { Editor, EditorContent, EditorMenuBar } from "tiptap"
import {
  Image,
  Link,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Strike,
  Underline,
  // @ts-ignore
} from "tiptap-extensions"

import altDialog from "@/components/altDialog.vue"

@Component({ components: { EditorContent, EditorMenuBar, altDialog } })
export default class TipTapEditor extends Vue {
  @Prop() value!: string
  @Prop() label!: string

  linkDialog = false
  hyperlink = ""
  focus = false

  editor = new Editor({
    extensions: [
      new Image(),
      new Link(),
      new OrderedList(),
      new BulletList(),
      new ListItem(),
      new Bold(),
      new Italic(),
      new Strike(),
      new Underline(),
    ],
    content: this.value,
  })

  async showImagePrompt(e: any, command?: any): Promise<void> {
    try {
      // @ts-ignore
      const file = await this.$refs.fileList.uploadFile(e)
      const src = "/Data/Uploads/" + file.fileName

      command({ src })
    } catch {
      throw new Error("error")
    }
  }

  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss">
.fullEditor {
  .v-input__slot {
    padding: 0 !important;
    background: transparent !important;
    border-top-left-radius: 4px;
    border-width: thin 0 0 0;
    border-style: solid;
    border: 1px solid;
    transition: border-color 0.5s;

    &:after {
      display: none !important;
    }
  }

  &.v-input--focused {
    .v-input__slot {
      border: 2px solid;
      border-color: red;
    }
  }

  .v-label {
    position: absolute;
    top: 16px;
    margin-left: 8px;
    transform: translateY(-24px) scale(0.75);
    z-index: 1;
    height: 20px;
    line-height: 20px;
    line-height: 20px;
    pointer-events: none;
    padding: 0 4px;
  }
}

.theme--dark {
  .fullEditor {
    .v-input__slot {
      border-color: rgba(255, 255, 255, 0.7);
    }
    .v-label {
      background-image: linear-gradient(
        to bottom,
        transparent,
        transparent 40%,
        #424242 40%,
        #424242,
        #424242 60%,
        transparent 60%,
        transparent
      );
    }
  }
}

.theme--light {
  .fullEditor {
    .v-input__slot {
      border-color: rgba(0, 0, 0, 0.24);
    }
    .v-label {
      background-image: linear-gradient(
        to bottom,
        transparent,
        transparent 40%,
        white 40%,
        white,
        white 60%,
        transparent 60%,
        transparent
      );
    }
  }
}

.ProseMirror,
.ProseMirror-focused {
  outline: none !important;
  min-height: 100px;
  max-height: 350px;
  font-size: 16px;
  overflow: scroll;
  transition: all 0.5s;
  padding: 8px 12px;

  height: 100%;
  width: 100%;

  p {
    color: black;
  }
}

.theme--light .ProseMirror {
  p {
    color: black;
  }
  color: black;
}

.theme--dark .ProseMirror {
  p {
    color: white;
  }
  color: white;
}

.ProseMirror table {
  td,
  th {
    padding: 7px;
    border: 1px solid grey;
  }
}

img {
  max-width: 100%;
}
</style>