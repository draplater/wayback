function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var kz = getParameterByName('kz');
var pn = getParameterByName('pn');

if (kz) {
    new Vue({
        el: '#vue_app',
        template: '#tem',
        data: {
            post_id: getParameterByName('kz'),
            current_page: pn ? parseInt(pn) / 50 + 1 : 1,
            total_count: null,
            data: []
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            async fetchData() {
                // 1. Fetch the size JSON file for the thread
                const size_res = await fetch(`all_posts/${this.post_id}_size.json`);
                const size_data = await size_res.json();
                this.total_count = size_data.size;

                // 2. Calculate the current page
                this.current_page = Math.min(Math.max(this.current_page, 1), Math.ceil(this.total_count / 50));

                // 3. Fetch data from the page-specific JSON file
                const posts_res = await fetch(`all_posts/${this.post_id}_page${this.current_page}.json`);
                const fetched_data = await posts_res.json();
                this.data = fetched_data;
            }
        },
        computed: {
            total_pages() {
            return Math.ceil(this.total_count / 50);
            },
            pagination() {
            let start_page = Math.max(this.current_page - 4, 1);
            if (this.current_page > this.total_pages - 5 && this.total_pages - 9 > 0) {
                start_page = this.total_pages - 9;
            }
            let end_page = Math.min(start_page + 9, this.total_pages);
            return Array.from({ length: end_page - start_page + 1 }, (_, i) => start_page + i);
            },
        }
    });
} else {
    new Vue({
        el: '#vue_app',
        template: '#tem_index',
        data: {
            current_page: pn ? parseInt(pn) / 50 + 1 : 1,
            total_count: null,
            data: []
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            async fetchData() {
                // 1. Fetch the size JSON file
                const size_res = await fetch('all_thread_titles/size.json');
                const size_data = await size_res.json();
                this.total_count = size_data.size;

                // 2. Calculate the current page
                this.current_page = Math.min(Math.max(this.current_page, 1), Math.ceil(this.total_count / 50));

                // 3. Fetch data from the page-specific JSON file
                const threads_res = await fetch(`all_thread_titles/page${this.current_page}.json`);
                const fetched_data = await threads_res.json();
                this.data = fetched_data;
            }
        },
        computed: {
            start_page() {
                let start = this.current_page - 4;
                if (this.current_page > this.total_count - 5) {
                    start = this.total_count - 9;
                }
                return start > 0 ? start : 1;
            },
            end_page() {
                const end = this.start_page + 9;
                return end < this.total_count ? end : this.total_count;
            },
            pages() {
                return Array.from({ length: this.end_page - this.start_page + 1 }, (_, i) => i + this.start_page);
            }
        }
    }); 
}
