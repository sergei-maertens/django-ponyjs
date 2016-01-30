export function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

export default function addCsrfToken(client, processor, message) {
    if (!csrfSafeMethod(message.method)) {
        message.headers.add(client._csrf.key, client._csrf.value);
    }
};
