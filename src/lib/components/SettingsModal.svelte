<script lang="ts">
    import { settings } from "$lib/stores/settings";

    interface Props {
        isOpen: boolean;
        onClose: () => void;
    }

    let { isOpen = $bindable(), onClose }: Props = $props();

    let basePathInput = $state($settings.basePath);
    let showSuccess = $state(false);

    function handleSave() {
        settings.setBasePath(basePathInput);
        showSuccess = true;
        setTimeout(() => {
            showSuccess = false;
            onClose();
        }, 1000);
    }

    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            onClose();
        }
    }
</script>

<div
    class="modal"
    class:active={isOpen}
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="button"
    tabindex="0"
    aria-label="Close modal"
>
    <div class="modal-content">
        <div class="modal-header">
            <h2>设置</h2>
            <button class="close-btn" onclick={onClose} aria-label="关闭">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label for="basePath">本地路径前缀</label>
                <input
                    type="text"
                    id="basePath"
                    bind:value={basePathInput}
                    placeholder="例如: /Users/username/"
                    class="input-field"
                />
                <p class="help-text">
                    设置本地文件的基础路径，用于拼接相对路径
                </p>
            </div>
            <button
                class="btn btn-primary"
                onclick={handleSave}
                style={showSuccess
                    ? "background: linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : ""}
            >
                {showSuccess ? "✓ 已保存" : "保存设置"}
            </button>
        </div>
    </div>
</div>
